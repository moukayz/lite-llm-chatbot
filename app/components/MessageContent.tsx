import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight"; // optional for code highlight
import "highlight.js/styles/github.css"; // or any style you like
import "katex/dist/katex.min.css";

type MessageProps = {
  role: "user" | "assistant" | "system";
  content: string;
  isStreaming?: boolean;
};

export function MessageContent({
  role,
  content,
  isStreaming = false,
}: MessageProps) {
  if (role === "user") {
    return <div>{content}</div>;
  } else if (!content) {
    return (
      isStreaming && (
        <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse"></span>
      )
    );
  } else {
    console.log(`bot content: ${content}`);
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
}
