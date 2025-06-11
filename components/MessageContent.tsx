import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight"; // optional for code highlight
import "highlight.js/styles/github.css"; // or any style you like
import "katex/dist/katex.min.css";
import { Message } from "../types/chat";
import { CollapsibleLine } from "./CollapsibleLine";

function normalizeMathMarkdown(markdown: string): string {
  const text = markdown.replace(
    /\\\[(.*?)\\\]/gs,
    (_, inside) => `$$${inside}$$`
  );
  return text;
  // return markdown.replace(
  //   /(^|[\n\r]\s*)\\\[(.*?)\\\]($|[\n\r])/gs,
  //   (_, prefix, inside, suffix) => `${prefix}$$${inside}$$${suffix}`
  // );
}

type MessageProps = {
  content: Message;
  isStreaming?: boolean;
};

const ThinkingContent: React.FC<{ content: string; isThinking: boolean }> = ({
  content,
  isThinking,
}) => {
  return (
    <CollapsibleLine
      heading={isThinking ? "Thinking" : "Thought Process"}
      isOpen={isThinking}
      isShimmering={isThinking}
    >
      <div className="bg-gray-100 rounded-md p-4 text-gray-500 prose max-w-none pt-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </CollapsibleLine>
  );
};

export function AssistantMessageContent({
  content,
  isStreaming = false,
}: MessageProps) {
  let mainBlock = null;
  if (!content) {
    mainBlock = isStreaming && (
      <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse"></span>
    );
  } else {
    const isThinking = content.content.length === 0;
    mainBlock = (
      <>
        {content.thinkingContent && (
          <ThinkingContent
            content={normalizeMathMarkdown(content.thinkingContent)}
            isThinking={isThinking}
          />
        )}

        <div className="pt-2 prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeHighlight]}
          >
            {normalizeMathMarkdown(content.content)}
          </ReactMarkdown>
        </div>
      </>
    );
  }

  return (
    <div className={`bg-gray-50 py-5`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className={`flex flex-col items-start justify-start`}>
          {mainBlock}
        </div>
      </div>
    </div>
  );
}

export function UserMessageContent({ content }: { content: string }) {
  return (
    <div className={`bg-gray-50  py-10`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className={`flex items-start justify-end`}>
          <div className={`bg-gray-200 text-gray-800 rounded-full py-4 px-8`}>{content}</div>
        </div>
      </div>
    </div>
  );
}
