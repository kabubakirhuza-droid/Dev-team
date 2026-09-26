export type TaskStatus =
  | 'planning'
  | 'implementing'
  | 'testing'
  | 'reviewing'
  | 'fixing'
  | 'approved'
  | 'blocked';

export interface Task {
  id: string;
  projectPath: string | null;
  title: string;
  status: TaskStatus;
  iteration: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  projectPath?: string | null;
}
