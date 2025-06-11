"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

/**
 * ChatResponseDemo — **self‑contained** version (no network calls)
 *
 * • Simulates a streaming server by generating random Lorem‑Ipsum words
 *   on the client side and emitting them in small chunks.
 * • Smooth type‑writer animation (~15 ms per char).
 * • Live Markdown rendering with `react-markdown`.
 * • Pure TailwindCSS for styling — no external UI libs.
 */
export default function ChatDemoPage() {
  const [visibleText, setVisibleText] = useState("");
  const [bufferText, setBufferText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------------ */
  /*  Tiny fake «server» that yields random words as a stream            */
  /* ------------------------------------------------------------------ */
  async function* fakeResponseGenerator(totalWords: number) {
    const words = [
      "lorem",
      "ipsum",
      "dolor",
      "sit",
      "amet,",
      "consectetur",
      "adipiscing",
      "elit.",
      "Phasellus",
      "fermentum",
      "velit",
      "nec",
      "leo",
      "pulvinar,",
      "a",
      "tempor",
      "sapien",
      "tincidunt.",
      "**Markdown**",
      "_formatting_",
      "`inline code`",
      "1.",
      "List",
      "item",
      "> Blockquote",
    ];

    for (let i = 0; i < totalWords; i++) {
      // Random delay 60‑160 ms to mimic network latency
      await new Promise((r) => setTimeout(r, 60 + Math.random() * 100));
      yield words[Math.floor(Math.random() * words.length)] + " ";
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Type‑writer effect: every 15 ms reveal one more char from buffer   */
  /* ------------------------------------------------------------------ */

  const CHARS_PER_STEP = 10;
  const TYPING_INTERVAL = 10;

  useEffect(() => {
    if (visibleText.length >= bufferText.length) return;
    const id = setTimeout(() => {
      const nextLen = Math.min(
        visibleText.length + CHARS_PER_STEP,
        bufferText.length
      );
      setVisibleText(bufferText.slice(0, nextLen));
    }, TYPING_INTERVAL);
    return () => clearTimeout(id);
  }, [bufferText, visibleText]);

  /* ------------------------------------------------------------------ */
  /*  Main handler — start fake stream                                  */
  /* ------------------------------------------------------------------ */
  async function handleAsk() {
    setVisibleText("");
    setBufferText("");
    setLoading(true);

    for await (const chunk of fakeResponseGenerator(120)) {
      setBufferText((prev) => prev + chunk);
    }

    setLoading(false);
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="space-y-4 p-6">
          {/* Trigger button */}
          <button
            onClick={handleAsk}
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-md bg-slate-900 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate random answer"}
          </button>

          {/* Chat window */}
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className=" prose prose-slate max-w-none h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 leading-relaxed shadow-inner"
          >
            <ReactMarkdown>{visibleText}</ReactMarkdown>
            {loading && <span className="animate-pulse">▌</span>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
