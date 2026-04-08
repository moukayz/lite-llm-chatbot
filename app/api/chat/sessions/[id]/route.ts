import { NextResponse } from "next/server";
import * as pgChatSessionService from "@/services/pgChatSessionService";
import { Message } from "types/chat";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const messages = await pgChatSessionService.fetchChatSessionMessages(id);

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Chat session not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat session messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat session messages" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!Array.isArray(data.messages)) {
      return NextResponse.json(
        { error: "Messages field must be an array" },
        { status: 400 },
      );
    }

    const messages = data.messages as Message[];
    const updatedSession = await pgChatSessionService.updateChatSession(
      id,
      messages,
    );

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating chat session:", error);
    return NextResponse.json(
      { error: "Failed to update chat session" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const success = await pgChatSessionService.deleteChatSession(id);

    if (!success) {
      return NextResponse.json(
        { error: "Chat session not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return NextResponse.json(
      { error: "Failed to delete chat session" },
      { status: 500 },
    );
  }
}
