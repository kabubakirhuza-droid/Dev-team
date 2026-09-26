import { useState } from 'react';
import { TaskPanel } from './components/TaskPanel';
import { ConversationPanel } from './components/ConversationPanel';
import { ActivityPanel } from './components/ActivityPanel';
import './styles.css';

export function App() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <div className="app-shell">
      <header className="app-header">
        <span className="app-title">AI DEV TEAM</span>
        <span className="app-phase">Phase 1 scaffold</span>
      </header>
      <main className="app-main">
        <TaskPanel selectedTaskId={selectedTaskId} onSelectTask={setSelectedTaskId} />
        <ConversationPanel taskId={selectedTaskId} />
        <ActivityPanel taskId={selectedTaskId} />
      </main>
    </div>
  );
}
