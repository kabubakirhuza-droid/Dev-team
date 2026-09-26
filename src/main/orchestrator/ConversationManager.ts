import type { ConversationMessage, AddConversationMessageInput } from '@shared/types/conversation';
import { ConversationRepository } from '../storage/repositories/ConversationRepository';
import { TaskRepository } from '../storage/repositories/TaskRepository';

/**
 * Phase 1: только персист и чтение сообщений привязанных к существующей задаче.
 * В следующих Phase сюда будут писать ChatGPTAdapter/ClaudeAdapter и PromptBuilder —
 * сейчас add() может быть вызван только вручную из renderer (например, для теста
 * персистентности), без какой-либо отправки во внешние сервисы.
 */
export class ConversationManager {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly taskRepository: TaskRepository
  ) {}

  add(input: AddConversationMessageInput): ConversationMessage {
    const task = this.taskRepository.getById(input.taskId);
    if (!task) {
      throw new Error(`Cannot add message: task ${input.taskId} does not exist`);
    }

    return this.conversationRepository.add(input);
  }

  listByTask(taskId: string): ConversationMessage[] {
    return this.conversationRepository.listByTask(taskId);
  }
}
