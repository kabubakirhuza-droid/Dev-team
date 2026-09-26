import '@shared/types/ipc-contracts';

/**
 * window.api существует только благодаря preload.ts (contextBridge).
 * Компоненты импортируют api отсюда, а не обращаются к window напрямую —
 * если понадобится подменить транспорт (например, в тестах renderer без Electron),
 * меняется только этот файл.
 */
export const api = window.api;
