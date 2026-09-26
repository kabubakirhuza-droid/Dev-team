import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import type {
  ActivityEvent,
  AddActivityEventInput,
  ActivityActor,
  ActivityStatus
} from '@shared/types/activity';

interface ActivityRow {
  id: string;
  task_id: string;
  actor: ActivityActor;
  action: string;
  status: ActivityStatus;
  duration_ms: number | null;
  created_at: string;
}

function rowToEvent(row: ActivityRow): ActivityEvent {
  return {
    id: row.id,
    taskId: row.task_id,
    actor: row.actor,
    action: row.action,
    status: row.status,
    durationMs: row.duration_ms,
    createdAt: row.created_at
  };
}

export class ActivityRepository {
  constructor(private readonly db: Database.Database) {}

  add(input: AddActivityEventInput): ActivityEvent {
    const row: ActivityRow = {
      id: randomUUID(),
      task_id: input.taskId,
      actor: input.actor,
      action: input.action,
      status: input.status,
      duration_ms: input.durationMs ?? null,
      created_at: new Date().toISOString()
    };

    this.db
      .prepare(
        `INSERT INTO activity_events (id, task_id, actor, action, status, duration_ms, created_at)
         VALUES (@id, @task_id, @actor, @action, @status, @duration_ms, @created_at)`
      )
      .run(row);

    return rowToEvent(row);
  }

  listByTask(taskId: string): ActivityEvent[] {
    const rows = this.db
      .prepare('SELECT * FROM activity_events WHERE task_id = ? ORDER BY created_at ASC')
      .all(taskId) as ActivityRow[];
    return rows.map(rowToEvent);
  }
}
