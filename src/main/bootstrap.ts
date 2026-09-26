import path from 'node:path';
import { app } from 'electron';
import { initDatabase } from './storage/db';
import { TaskRepository } from './storage/repositories/TaskRepository';
import { ConversationRepository } from './storage/repositories/ConversationRepository';
import { ActivityRepository } from './storage/repositories/ActivityRepository';
import { TaskManager } from './orchestrator/TaskManager';
import { ConversationManager } from './orchestrator/ConversationManager';
import { WorkflowEngine } from './orchestrator/WorkflowEngine';
import { registerTaskIpcHandlers } from './ipc/handlers/task.ipc';
import { registerConversationIpcHandlers } from './ipc/handlers/conversation.ipc';
import { registerActivityIpcHandlers } from './ipc/handlers/activity.ipc';
import { registerWorkflowIpcHandlers } from './ipc/handlers/workflow.ipc';

/**
 * Phase 1: глобальная (не per-project) SQLite-база в userData Electron.
 * Per-project `.ai-dev-team/` (раздел 32 ТЗ) появится вместе с ProjectScanner
 * в Phase 2 — сейчас задачи не привязаны к выбранному проекту жёстко,
 * только опциональным полем projectPath.
 */
export function bootstrapMain(): void {
  const dbFilePath = path.join(app.getPath('userData'), 'ai-dev-team.db');
  const db = initDatabase(dbFilePath);

  const taskRepository = new TaskRepository(db);
  const conversationRepository = new ConversationRepository(db);
  const activityRepository = new ActivityRepository(db);

  const taskManager = new TaskManager(taskRepository, activityRepository);
  const conversationManager = new ConversationManager(conversationRepository, taskRepository);
  const workflowEngine = new WorkflowEngine(taskRepository, activityRepository);

  registerTaskIpcHandlers(taskManager);
  registerConversationIpcHandlers(conversationManager);
  registerActivityIpcHandlers(activityRepository);
  registerWorkflowIpcHandlers(workflowEngine);
}
