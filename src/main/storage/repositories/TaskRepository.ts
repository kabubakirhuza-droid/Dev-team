import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import type { Task, CreateTaskInput, TaskStatus } from '@shared/types/task';

interface TaskRow {
  id: string;
  project_path: string | null;
  title: string;
  status: TaskStatus;
  iteration: number;
  created_at: string;
  updated_at: string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    projectPath: row.project_path,
    title: row.title,
    status: row.status,
    iteration: row.iteration,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class TaskRepository {
  constructor(private readonly db: Database.Database) {}

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const row: TaskRow = {
      id: randomUUID(),
      project_path: input.projectPath ?? null,
      title: input.title,
      status: 'planning',
      iteration: 0,
      created_at: now,
      updated_at: now
    };

    this.db
      .prepare(
        `INSERT INTO tasks (id, project_path, title, status, iteration, created_at, updated_at)
         VALUES (@id, @project_path, @title, @status, @iteration, @created_at, @updated_at)`
      )
      .run(row);

    return rowToTask(row);
  }

  list(): Task[] {
    const rows = this.db
      .prepare('SELECT * FROM tasks ORDER BY created_at DESC')
      .all() as TaskRow[];
    return rows.map(rowToTask);
  }

  getById(id: string): Task | null {
    const row = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as
      | TaskRow
      | undefined;
    return row ? rowToTask(row) : null;
  }
}
