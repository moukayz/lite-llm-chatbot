"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion, Variants } from "motion/react";

// --- 1) Our SplitText component, same as before ---
interface SplitTextProps {
  text: string;
  className?: string;
}

const SplitText: React.FC<SplitTextProps> = ({ text, className }) => {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    },
  };
  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", duration: 2, bounce: 0 },
    },
  };

  return (
    <motion.span
      className={`${className} inline-flex flex-wrap`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-1 will-change-transform will-change-opacity"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

// --- 2) Mock streaming source ---
async function* fakeMarkdownStream() {
  const chunks = [
    "# Welcome to the Stream\n\n",
    "This is a **streaming** paragraph that builds up bit by bit. ",
    "You’ll see it animate as it arrives!\n\n",
    "## Another Heading\n\n",
    "And here’s one more sentence to close it out.",
  ];
  for (const chunk of chunks) {
    // simulate network latency
    await new Promise((r) => setTimeout(r, 1000));
    yield chunk;
  }
}

// --- 3) Main component that pulls it all together ---
export default function StreamingMarkdown() {
  const [md, setMd] = useState("");

  useEffect(() => {
    (async () => {
      for await (let chunk of fakeMarkdownStream()) {
        setMd((prev) => prev + chunk);
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <ReactMarkdown
        // 4) Tell react-markdown how to render headings and paragraphs
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold">
              <SplitText text={String(props.children)} />
            </h1>
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-semibold">
              <SplitText text={String(props.children)} />
            </h2>
          ),
          p: ({ node, ...props }) => (
            <motion.p
              className="text-base leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {props.children}
            </motion.p>
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </div>
  );
}
