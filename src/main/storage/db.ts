import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { MIGRATIONS } from './migrations';

let dbInstance: Database.Database | null = null;

/**
 * Открывает (или создаёт) SQLite-файл по указанному пути и применяет
 * все ещё не применённые миграции из MIGRATIONS по порядку id.
 * Идемпотентно: повторный вызов с уже примененными миграциями — no-op.
 *
 * Нативный модуль (better-sqlite3), пересобирается под ABI Electron
 * через `postinstall: electron-rebuild -f -w better-sqlite3` (см. package.json).
 * Встроенный node:sqlite сознательно НЕ используется: он появился в Node
 * только с 22.5+, а Electron несёт собственный, более старый встроенный
 * Node — модуль был бы недоступен в реальном приложении.
 */
export function initDatabase(dbFilePath: string): Database.Database {
  fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });

  const db = new Database(dbFilePath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const appliedIds = new Set(
    db.prepare('SELECT id FROM migrations').all().map((row) => (row as { id: string }).id)
  );

  const applyMigration = db.transaction((id: string, sql: string) => {
    db.exec(sql);
    db.prepare('INSERT INTO migrations (id, applied_at) VALUES (?, ?)').run(
      id,
      new Date().toISOString()
    );
  });

  for (const migration of MIGRATIONS) {
    if (!appliedIds.has(migration.id)) {
      applyMigration(migration.id, migration.sql);
    }
  }

  dbInstance = db;
  return db;
}

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    throw new Error('Database is not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}

export function closeDatabase(): void {
  dbInstance?.close();
  dbInstance = null;
}
