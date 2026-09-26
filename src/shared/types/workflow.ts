export type WorkflowStep =
  | 'idle'
  | 'gpt_analyze'
  | 'claude_implement'
  | 'run_tests'
  | 'gpt_review'
  | 'claude_fix'
  | 'blocked'
  | 'approved';

export type WorkflowMode = 'manual' | 'auto';

export interface WorkflowState {
  taskId: string;
  step: WorkflowStep;
  iteration: number;
  mode: WorkflowMode;
  /**
   * Phase 1: WorkflowEngine — безопасная заглушка.
   * Это поле фиксирует, что реальные переходы (agent adapters, local executor)
   * ещё не подключены, чтобы UI не воспринимал stub как рабочий workflow.
   */
  isStub: true;
}
