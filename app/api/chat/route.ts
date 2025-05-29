import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { config } from '../../config';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.dashscopeApiKey,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

// Default model if none is provided
const defaultModel = 'qwen-max';

export async function POST(request: Request) {
  try {
    const { messages, model } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    if (!config.dashscopeApiKey) {
      console.error('Dashscope API key is not configured');
      return NextResponse.json(
        { error: 'Dashscope API key is not configured' },
        { status: 500 }
      );
    }

    // Use the provided model or fall back to the default
    const modelToUse = model || defaultModel;
    console.log(`Using model: ${modelToUse}`);

    // Create a streaming response
    const stream = await openai.chat.completions.create({
      model: modelToUse,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true, // Enable streaming
    });

    // Create a text encoder
    const encoder = new TextEncoder();

    // Create a ReadableStream directly from the OpenAI stream
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            const data = `data: ${JSON.stringify({ text })}\n\n`
            // console.log(data);
            controller.enqueue(encoder.encode(data));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    // Return the stream as a response
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Transfer-Encoding': 'chunked',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
} 