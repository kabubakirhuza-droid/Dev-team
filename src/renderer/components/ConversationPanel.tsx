import { useEffect, useState } from 'react';
import type { ConversationMessage } from '@shared/types/conversation';
import { api } from '../ipc/api';

interface ConversationPanelProps {
  taskId: string | null;
}

export function ConversationPanel({ taskId }: ConversationPanelProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [draft, setDraft] = useState('');

  async function refresh(id: string) {
    const list = await api.conversation.list(id);
    setMessages(list);
  }

  useEffect(() => {
    if (taskId) {
      refresh(taskId);
    } else {
      setMessages([]);
    }
  }, [taskId]);

  async function handleAdd() {
    if (!taskId || !draft.trim()) return;
    await api.conversation.add({ taskId, author: 'user', content: draft });
    setDraft('');
    await refresh(taskId);
  }

  if (!taskId) {
    return (
      <div className="panel conversation-panel">
        <h2>Conversation</h2>
        <p className="hint">Select or create a task</p>
      </div>
    );
  }

  return (
    <div className="panel conversation-panel">
      <h2>Conversation</h2>
      <ul className="message-list">
        {messages.map((m) => (
          <li key={m.id} className={`message author-${m.author}`}>
            <div className="message-author">{m.roleLabel ?? m.author.toUpperCase()}</div>
            <div className="message-content">{m.content}</div>
          </li>
        ))}
        {messages.length === 0 && <li className="hint">No messages yet</li>}
      </ul>
      <div className="message-compose">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Test message (persistence check, Phase 1 only)"
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
