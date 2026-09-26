import type { Task, CreateTaskInput } from '@shared/types/task';
import { TaskRepository } from '../storage/repositories/TaskRepository';
import { ActivityRepository } from '../storage/repositories/ActivityRepository';

/**
 * Phase 1: только создание/чтение задач и фиксация факта создания в Activity Log.
 * Переходы статусов, checkpoint-привязка и работа с итерациями (см. architecture-v2.md,
 * раздел 3) появятся вместе с WorkflowEngine в рабочем режиме — сейчас статус
 * задачи всегда остаётся 'planning' после создания.
 */
export class TaskManager {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly activityRepository: ActivityRepository
  ) {}

  create(input: CreateTaskInput): Task {
    if (!input.title || !input.title.trim()) {
      throw new Error('Task title must not be empty');
    }

    const task = this.taskRepository.create(input);

    this.activityRepository.add({
      taskId: task.id,
      actor: 'user',
      action: 'Task created',
      status: 'done'
    });

    return task;
  }

  list(): Task[] {
    return this.taskRepository.list();
  }

  getById(id: string): Task | null {
    return this.taskRepository.getById(id);
  }
}
