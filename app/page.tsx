"use client";

import { ChatArea } from "./components/ChatArea";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-600">
      <ChatArea />
    </main>
  );
}
