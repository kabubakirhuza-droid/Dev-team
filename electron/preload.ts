import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, type IpcApi } from '../src/shared/types/ipc-contracts';

/**
 * Единственное место, где renderer-у "разрешается" что-либо вызвать в main.
 * Никакого ipcRenderer/require не попадает в renderer напрямую — только
 * это заранее зафиксированное, типизированное API. Реализация 1:1
 * повторяет IpcApi из ipc-contracts.ts, поэтому расхождение сигнатур
 * здесь и в handlers ловится компилятором, а не в рантайме.
 */
const api: IpcApi = {
  task: {
    create: (input) => ipcRenderer.invoke(IPC_CHANNELS.taskCreate, input),
    list: () => ipcRenderer.invoke(IPC_CHANNELS.taskList),
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.taskGet, id)
  },
  conversation: {
    list: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.conversationList, taskId),
    add: (input) => ipcRenderer.invoke(IPC_CHANNELS.conversationAdd, input)
  },
  activity: {
    list: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.activityList, taskId),
    add: (input) => ipcRenderer.invoke(IPC_CHANNELS.activityAdd, input)
  },
  workflow: {
    getState: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.workflowGetState, taskId),
    startStub: (taskId) => ipcRenderer.invoke(IPC_CHANNELS.workflowStartStub, taskId)
  }
};

contextBridge.exposeInMainWorld('api', api);
