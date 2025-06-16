import { useCallback, useState } from "react";
import { Message } from "../types/chat";

export type MessageChunk = {
  text: string;
  type: "thinking" | "answer";
  isDone: boolean;
};

interface UseChatOptions {
  onError?: (error: Error) => void;
  onStreamUpdate: (updatedContent: MessageChunk) => void;
}

export function useChat(options: UseChatOptions) {
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(
    async (messages: Message[], modelCode: string): Promise<void> => {
      try {
        setIsStreaming(true);
        console.log("Sending message:", messages);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            model: modelCode,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        // Process the streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";
        let thinkingContent = "";

        while (true) {
          const { value, done: doneReading } = await reader.read();
          if (doneReading) {
            options.onStreamUpdate({
              text: "",
              type: "answer",
              isDone: true,
            });
            break;
          }

          if (value) {
            const chunkText = decoder.decode(value);
            const lines = chunkText
              .split("\n\n")
              .filter((line) => line.startsWith("data: "))
              .map((line) => line.replace("data: ", ""));

            for (const line of lines) {
              if (line === "[DONE]") continue;

              try {
                console.log("line", line);
                const { text, type } = JSON.parse(line);
                let currentContent = "";
                if (type === "thinking") {
                  thinkingContent += text;
                  currentContent = thinkingContent;
                } else {
                  accumulatedContent += text;
                  currentContent = accumulatedContent;
                }

                options.onStreamUpdate({
                  text: currentContent,
                  type: type,
                  isDone: false,
                });
              } catch (err) {
                console.error("Error parsing stream data:", err);
              }
            }
          }
        }

      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Chat error:", errorMessage);

        if (options.onError) {
          options.onError(
            error instanceof Error ? error : new Error(errorMessage)
          );
        }

      } finally {
        setIsStreaming(false);
      }
    },
    [options]
  );

  return {
    isStreaming,
    sendMessage,
  };
}
