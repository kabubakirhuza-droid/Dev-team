import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/types/ipc-contracts';
import type { AddConversationMessageInput } from '@shared/types/conversation';
import type { ConversationManager } from '../../orchestrator/ConversationManager';

export function registerConversationIpcHandlers(conversationManager: ConversationManager): void {
  ipcMain.handle(IPC_CHANNELS.conversationList, (_event, taskId: string) => {
    return conversationManager.listByTask(taskId);
  });

  ipcMain.handle(IPC_CHANNELS.conversationAdd, (_event, input: AddConversationMessageInput) => {
    return conversationManager.add(input);
  });
}
