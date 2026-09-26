import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/types/ipc-contracts';
import type { CreateTaskInput } from '@shared/types/task';
import type { TaskManager } from '../../orchestrator/TaskManager';

export function registerTaskIpcHandlers(taskManager: TaskManager): void {
  ipcMain.handle(IPC_CHANNELS.taskCreate, (_event, input: CreateTaskInput) => {
    return taskManager.create(input);
  });

  ipcMain.handle(IPC_CHANNELS.taskList, () => {
    return taskManager.list();
  });

  ipcMain.handle(IPC_CHANNELS.taskGet, (_event, id: string) => {
    return taskManager.getById(id);
  });
}
