import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight"; // optional for code highlight
import "highlight.js/styles/github.css"; // or any style you like
import "katex/dist/katex.min.css";

function normalizeMathMarkdown(markdown: string): string {
  const text = markdown.replace(/\\\[(.*?)\\\]/gs, (_, inside) => `$$${inside}$$`);
  return text;
  // return markdown.replace(
  //   /(^|[\n\r]\s*)\\\[(.*?)\\\]($|[\n\r])/gs,
  //   (_, prefix, inside, suffix) => `${prefix}$$${inside}$$${suffix}`
  // );
}

type MessageProps = {
  content: string;
  isStreaming?: boolean;
};

export function MessageContent({ content, isStreaming = false }: MessageProps) {
  if (!content) {
    return (
      isStreaming && (
        <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse"></span>
      )
    );
  } else {
    return (
      <div className={`bg-gray-50 py-5`}>
        <div className="max-w-3xl mx-auto px-4">
          <div className={`flex items-start justify-start`}>
            <div className="prose max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
              >
                {normalizeMathMarkdown(content)}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export function UserMessageContent({ content }: { content: string }) {
  return (
    <div className={`bg-gray-50  py-10`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className={`flex items-start justify-end`}>
          <div className={`bg-gray-200 rounded-full py-4 px-8`}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
