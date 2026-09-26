export type ActivityActor = 'gpt' | 'claude' | 'system' | 'user';
export type ActivityStatus = 'pending' | 'running' | 'done' | 'failed';

export interface ActivityEvent {
  id: string;
  taskId: string;
  actor: ActivityActor;
  action: string;
  status: ActivityStatus;
  durationMs: number | null;
  createdAt: string;
}

export interface AddActivityEventInput {
  taskId: string;
  actor: ActivityActor;
  action: string;
  status: ActivityStatus;
  durationMs?: number | null;
}
