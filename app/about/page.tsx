"use client";

import { Metadata } from 'next';
const siteMetadata: Metadata = {
  title: "ChatBot with OpenAI",
  description: "A simple chatbot powered by OpenAI",
};

const AboutPage = () => {
  return (
    <main className="h-full bg-gray-50 text-gray-600">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">About This Application</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="mb-4">
            <span className="font-semibold">Title:</span> {siteMetadata.title as string}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Description:</span> {siteMetadata.description as string}
          </p>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Technical Information</h2>
            <p>This application is built with Next.js and uses OpenAI&apos;s API to power the chatbot functionality.</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage; 