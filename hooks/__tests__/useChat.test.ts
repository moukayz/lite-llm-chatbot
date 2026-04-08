import { renderHook, act } from "@testing-library/react";
import { useChat } from "../useChat";
import type { Message } from "../../types/chat";

const encode = (s: string) => new TextEncoder().encode(s);

describe("useChat", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("streams updates and toggles isStreaming", async () => {
    const onStreamUpdate = jest.fn();
    const onError = jest.fn();
    const onFinalResponse = jest.fn();

    // Prepare mock reader that yields three chunks then ends
    const chunks = [
      'data: {"text":"Thinking... ", "type":"thinking"}\n\n',
      'data: {"text":"Hello", "type":"answer"}\n\n',
      'data: {"text":" World", "type":"answer"}\n\n' + "data: [DONE]\n\n",
    ];

    const read = jest
      .fn()
      .mockResolvedValueOnce({ value: encode(chunks[0]), done: false })
      .mockResolvedValueOnce({ value: encode(chunks[1]), done: false })
      .mockResolvedValueOnce({ value: encode(chunks[2]), done: false })
      .mockResolvedValueOnce({ value: undefined, done: true });

    // @ts-expect-error partial Response mock
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => ({ read }) },
    });

    const { result } = renderHook(() =>
      useChat({ onStreamUpdate, onError, onFinalResponse }),
    );

    const messages: Message[] = [{ role: "user", content: "Hi" }];

    expect(result.current.isStreaming).toBe(false);

    await act(async () => {
      await result.current.sendMessage(messages, "qwen-max");
    });

    // fetch was called with correct parameters
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );

    // First thinking update
    expect(onStreamUpdate).toHaveBeenCalledWith({
      text: "Thinking... ",
      type: "thinking",
      isDone: false,
    });
    // Then answer chunks accumulate
    expect(onStreamUpdate).toHaveBeenCalledWith({
      text: "Hello",
      type: "answer",
      isDone: false,
    });
    expect(onStreamUpdate).toHaveBeenCalledWith({
      text: "Hello World",
      type: "answer",
      isDone: false,
    });
    // Final done signal
    expect(onStreamUpdate).toHaveBeenCalledWith({
      text: "",
      type: "answer",
      isDone: true,
    });
    expect(onFinalResponse).toHaveBeenCalledTimes(1);

    expect(result.current.isStreaming).toBe(false);
    expect(onError).not.toHaveBeenCalled();
  });

  test("handles abort gracefully and calls onError", async () => {
    const onStreamUpdate = jest.fn();
    const onError = jest.fn();
    const onFinalResponse = jest.fn();

    // Mock fetch that rejects when aborted
    // @ts-expect-error partial Response mock
    global.fetch = jest.fn((_: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          const err: any = new Error("Aborted");
          err.name = "AbortError";
          reject(err);
        });
      });
    });

    const { result } = renderHook(() =>
      useChat({ onStreamUpdate, onError, onFinalResponse }),
    );

    const messages: Message[] = [{ role: "user", content: "Hi" }];

    await act(async () => {
      const p = result.current.sendMessage(messages, "qwen-max");
      // Abort immediately
      result.current.abort();
      await p;
    });

    expect(onError).toHaveBeenCalled();
    expect(onFinalResponse).not.toHaveBeenCalled();
    const err = onError.mock.calls[0][0] as Error;
    expect(err.name).toBe("AbortError");
    expect(result.current.isStreaming).toBe(false);
  });

  test("handles non-ok response by calling onError", async () => {
    const onStreamUpdate = jest.fn();
    const onError = jest.fn();
    const onFinalResponse = jest.fn();

    // @ts-expect-error partial Response mock
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    const { result } = renderHook(() =>
      useChat({ onStreamUpdate, onError, onFinalResponse }),
    );

    const messages: Message[] = [{ role: "user", content: "Hi" }];

    await act(async () => {
      await result.current.sendMessage(messages, "qwen-max");
    });

    expect(onError).toHaveBeenCalled();
    expect(onFinalResponse).not.toHaveBeenCalled();
    expect(result.current.isStreaming).toBe(false);
  });
});
