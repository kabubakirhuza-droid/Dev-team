import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/types/ipc-contracts';
import type { AddActivityEventInput } from '@shared/types/activity';
import type { ActivityRepository } from '../../storage/repositories/ActivityRepository';

export function registerActivityIpcHandlers(activityRepository: ActivityRepository): void {
  ipcMain.handle(IPC_CHANNELS.activityList, (_event, taskId: string) => {
    return activityRepository.listByTask(taskId);
  });

  ipcMain.handle(IPC_CHANNELS.activityAdd, (_event, input: AddActivityEventInput) => {
    return activityRepository.add(input);
  });
}
