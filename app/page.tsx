'use client';

import { ChatArea } from './components/ChatArea';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      <div className="z-10 w-full flex flex-row relative h-screen">
        <ChatArea />
      </div>
    </main>
  );
}
