# ChatBot with OpenAI

A simple chatbot application built with Next.js and OpenAI API.

## Features

- Real-time chat interface
- Streaming responses for a natural chat experience
- Markdown support for rich text formatting, code blocks, formulas, etc.
- Powered by OpenAI's GPT models
- TypeScript for type safety
- Responsive design with Tailwind CSS

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd lite-llm-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
```
DASH_SCOPE_API_KEY=your_dashscope_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

| Variable | Description |
| --- | --- |
| `DASH_SCOPE_API_KEY` | Dashscope API key (Alibaba Cloud) |
| `OPENAI_API_KEY` | OpenAI API key (optional) |

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Tailwind Typography
- **API**: OpenAI-compatible API (Dashscope)
- **Markdown**: React-Markdown with KaTeX for math formulas

## License

MIT
