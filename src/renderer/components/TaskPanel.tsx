import { useEffect, useState } from 'react';
import type { Task } from '@shared/types/task';
import { api } from '../ipc/api';

interface TaskPanelProps {
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
}

export function TaskPanel({ selectedTaskId, onSelectTask }: TaskPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const list = await api.task.list();
    setTasks(list);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate() {
    setError(null);
    try {
      const task = await api.task.create({ title });
      setTitle('');
      await refresh();
      onSelectTask(task.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="panel task-panel">
      <h2>Tasks</h2>
      <div className="task-create">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (test)"
        />
        <button onClick={handleCreate}>Create</button>
      </div>
      {error && <p className="error">{error}</p>}
      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={task.id === selectedTaskId ? 'selected' : ''}
            onClick={() => onSelectTask(task.id)}
          >
            <span className="task-title">{task.title}</span>
            <span className="task-status">{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
