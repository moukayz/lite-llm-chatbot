import { NextResponse } from "next/server";
import * as pgChatSessionService from "services/pgChatSessionService";
import { Message } from "types/chat";

export async function GET() {
  try {
    const sessions = await pgChatSessionService.fetchChatSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!Array.isArray(data.messages)) {
      return NextResponse.json(
        { error: "Messages field must be an array" },
        { status: 400 }
      );
    }
    
    const messages = data.messages as Message[];
    const newSession = await pgChatSessionService.createChatSession(messages);
    
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      { error: "Failed to create chat session" },
      { status: 500 }
    );
  }
} 