export type MessageAuthor = 'gpt' | 'claude' | 'user' | 'system';

export interface ConversationMessage {
  id: string;
  taskId: string;
  author: MessageAuthor;
  roleLabel: string | null;
  content: string;
  createdAt: string;
}

export interface AddConversationMessageInput {
  taskId: string;
  author: MessageAuthor;
  roleLabel?: string | null;
  content: string;
}
