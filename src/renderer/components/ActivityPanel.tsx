import { useEffect, useState } from 'react';
import type { ActivityEvent } from '@shared/types/activity';
import type { WorkflowState } from '@shared/types/workflow';
import { api } from '../ipc/api';

interface ActivityPanelProps {
  taskId: string | null;
}

export function ActivityPanel({ taskId }: ActivityPanelProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);

  async function refresh(id: string) {
    const [eventList, state] = await Promise.all([
      api.activity.list(id),
      api.workflow.getState(id)
    ]);
    setEvents(eventList);
    setWorkflowState(state);
  }

  useEffect(() => {
    if (taskId) {
      refresh(taskId);
    } else {
      setEvents([]);
      setWorkflowState(null);
    }
  }, [taskId]);

  async function handleStartStub() {
    if (!taskId) return;
    await api.workflow.startStub(taskId);
    await refresh(taskId);
  }

  if (!taskId) {
    return (
      <div className="panel activity-panel">
        <h2>Activity</h2>
        <p className="hint">Select or create a task</p>
      </div>
    );
  }

  return (
    <div className="panel activity-panel">
      <h2>Activity</h2>
      {workflowState && (
        <p className="workflow-state">
          workflow: step={workflowState.step}, mode={workflowState.mode}
          {workflowState.isStub ? ' (stub — no real agents wired yet)' : ''}
        </p>
      )}
      <button onClick={handleStartStub}>Trigger WorkflowEngine.startStub()</button>
      <ul className="activity-list">
        {events.map((e) => (
          <li key={e.id} className={`activity-status-${e.status}`}>
            <span className="activity-actor">[{e.actor}]</span> {e.action}
          </li>
        ))}
        {events.length === 0 && <li className="hint">No activity yet</li>}
      </ul>
    </div>
  );
}
