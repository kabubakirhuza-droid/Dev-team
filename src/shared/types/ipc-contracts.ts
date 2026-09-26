import type { Task, CreateTaskInput } from './task';
import type { ConversationMessage, AddConversationMessageInput } from './conversation';
import type { ActivityEvent, AddActivityEventInput } from './activity';
import type { WorkflowState } from './workflow';

/**
 * Единственный источник правды для имён IPC-каналов.
 * main и preload импортируют эти константы, а не хардкодят строки —
 * опечатка в канале станет ошибкой типов, а не тихим молчанием ipcMain.
 */
export const IPC_CHANNELS = {
  taskCreate: 'task:create',
  taskList: 'task:list',
  taskGet: 'task:get',
  conversationList: 'conversation:list',
  conversationAdd: 'conversation:add',
  activityList: 'activity:list',
  activityAdd: 'activity:add',
  workflowGetState: 'workflow:getState',
  workflowStartStub: 'workflow:startStub'
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];

/**
 * Контракт, который реализует preload.ts через contextBridge,
 * и на который типизированно опирается renderer (window.api).
 * Namespace ровно повторяет группировку IPC handlers в src/main/ipc/handlers.
 */
export interface IpcApi {
  task: {
    create(input: CreateTaskInput): Promise<Task>;
    list(): Promise<Task[]>;
    get(id: string): Promise<Task | null>;
  };
  conversation: {
    list(taskId: string): Promise<ConversationMessage[]>;
    add(input: AddConversationMessageInput): Promise<ConversationMessage>;
  };
  activity: {
    list(taskId: string): Promise<ActivityEvent[]>;
    add(input: AddActivityEventInput): Promise<ActivityEvent>;
  };
  workflow: {
    getState(taskId: string): Promise<WorkflowState>;
    /**
     * Phase 1: безопасная заглушка. Не запускает GPT/Claude, не трогает файлы —
     * только фиксирует событие в Activity Log и возвращает неизменный WorkflowState.
     */
    startStub(taskId: string): Promise<WorkflowState>;
  };
}

declare global {
  interface Window {
    api: IpcApi;
  }
}
