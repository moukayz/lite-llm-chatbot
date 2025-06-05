// Check if we have an API key
if (!process.env.OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY environment variable');
}

if (!process.env.DASH_SCOPE_API_KEY) {
  console.warn('Missing DASH_SCOPE_API_KEY environment variable');
}

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  dashscopeApiKey: process.env.DASH_SCOPE_API_KEY || '',
}; 