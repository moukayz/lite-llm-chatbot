export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinkingContent?: string;
};

export type Model = {
  name: string;
  code: string;
}; 

export type ChatSettings = {
  systemPrompt: string;
  model: Model;
  availableModels: Array<Model>;
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  firstMessage?: string;
}
