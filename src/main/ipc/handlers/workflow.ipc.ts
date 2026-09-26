import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '@shared/types/ipc-contracts';
import type { WorkflowEngine } from '../../orchestrator/WorkflowEngine';

export function registerWorkflowIpcHandlers(workflowEngine: WorkflowEngine): void {
  ipcMain.handle(IPC_CHANNELS.workflowGetState, (_event, taskId: string) => {
    return workflowEngine.getState(taskId);
  });

  ipcMain.handle(IPC_CHANNELS.workflowStartStub, (_event, taskId: string) => {
    return workflowEngine.startStub(taskId);
  });
}
