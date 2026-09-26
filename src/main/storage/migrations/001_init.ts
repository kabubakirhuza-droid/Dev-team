/**
 * Phase 1: только то, что реально используется — tasks, conversation_messages,
 * activity_events. Таблицы checkpoints/reviews (см. architecture-v2.md) сознательно
 * не создаются здесь — они появятся вместе с GitManager/ReviewManager в следующих Phase,
 * чтобы миграция не содержала колонок под функциональность, которой ещё нет.
 */
export const MIGRATION_001_INIT = {
  id: '001_init',
  sql: `
    CREATE TABLE tasks (
      id TEXT PRIMARY KEY,
      project_path TEXT,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'planning',
      iteration INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE conversation_messages (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      author TEXT NOT NULL,
      role_label TEXT,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX idx_conversation_messages_task_id ON conversation_messages(task_id);

    CREATE TABLE activity_events (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      duration_ms INTEGER,
      created_at TEXT NOT NULL
    );
    CREATE INDEX idx_activity_events_task_id ON activity_events(task_id);
  `
};
