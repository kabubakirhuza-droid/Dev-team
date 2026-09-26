import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import type {
  ConversationMessage,
  AddConversationMessageInput,
  MessageAuthor
} from '@shared/types/conversation';

interface MessageRow {
  id: string;
  task_id: string;
  author: MessageAuthor;
  role_label: string | null;
  content: string;
  created_at: string;
}

function rowToMessage(row: MessageRow): ConversationMessage {
  return {
    id: row.id,
    taskId: row.task_id,
    author: row.author,
    roleLabel: row.role_label,
    content: row.content,
    createdAt: row.created_at
  };
}

export class ConversationRepository {
  constructor(private readonly db: Database.Database) {}

  add(input: AddConversationMessageInput): ConversationMessage {
    const row: MessageRow = {
      id: randomUUID(),
      task_id: input.taskId,
      author: input.author,
      role_label: input.roleLabel ?? null,
      content: input.content,
      created_at: new Date().toISOString()
    };

    this.db
      .prepare(
        `INSERT INTO conversation_messages (id, task_id, author, role_label, content, created_at)
         VALUES (@id, @task_id, @author, @role_label, @content, @created_at)`
      )
      .run(row);

    return rowToMessage(row);
  }

  listByTask(taskId: string): ConversationMessage[] {
    const rows = this.db
      .prepare(
        'SELECT * FROM conversation_messages WHERE task_id = ? ORDER BY created_at ASC'
      )
      .all(taskId) as MessageRow[];
    return rows.map(rowToMessage);
  }
}
