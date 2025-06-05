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