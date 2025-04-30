'use client';

import { ChatArea } from './components/ChatArea';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 bg-gray-50">
      <div className="z-10 max-w-8xl w-full flex flex-col items-center justify-between">
        <h1 className="mb-8 text-3xl font-bold text-center">ChatBot</h1>
        <ChatArea />
      </div>
    </main>
  );
}
