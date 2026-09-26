import type { WorkflowState } from '@shared/types/workflow';
import { TaskRepository } from '../storage/repositories/TaskRepository';
import { ActivityRepository } from '../storage/repositories/ActivityRepository';

/**
 * Phase 1: WorkflowEngine — намеренно "пустой" по требованию:
 *  - НЕ вызывает никакие agent adapters (их ещё не существует);
 *  - НЕ трогает Local Executor (его ещё не существует);
 *  - НЕ меняет статус задачи;
 *  - startStub() лишь фиксирует факт вызова в Activity Log и возвращает
 *    состояние с step='idle', чтобы UI могло проверить IPC end-to-end,
 *    не создавая иллюзию работающего workflow.
 *
 * Реальная стейт-машина (STEP1..STEP8, см. architecture-v2.md раздел 5)
 * будет реализована в Phase 10, после того как появятся agent adapters
 * и Local Executor.
 */
export class WorkflowEngine {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly activityRepository: ActivityRepository
  ) {}

  getState(taskId: string): WorkflowState {
    const task = this.taskRepository.getById(taskId);
    if (!task) {
      throw new Error(`Cannot get workflow state: task ${taskId} does not exist`);
    }

    return {
      taskId,
      step: 'idle',
      iteration: task.iteration,
      mode: 'manual',
      isStub: true
    };
  }

  startStub(taskId: string): WorkflowState {
    const task = this.taskRepository.getById(taskId);
    if (!task) {
      throw new Error(`Cannot start workflow: task ${taskId} does not exist`);
    }

    this.activityRepository.add({
      taskId,
      actor: 'system',
      action: 'WorkflowEngine.startStub() called — no-op in Phase 1 (no adapters, no executor wired yet)',
      status: 'done'
    });

    return this.getState(taskId);
  }
}
