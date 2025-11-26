import { renderHook, waitFor } from '@testing-library/react';
import { useChatSession } from '../useChatSession';

describe('useChatSession', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('loads chat sessions and toggles loading state', async () => {
    const now = new Date();
    const rawSessions = [
      { id: 's1', title: 'First', createdAt: now.toISOString(), updatedAt: now.toISOString(), messageCount: 3, firstMessage: 'Hello' },
      { id: 's2', title: 'Second', createdAt: now.toISOString(), updatedAt: now.toISOString(), messageCount: 1, firstMessage: null },
    ];

    // Mock global fetch used by fetchChatSessions()
    // @ts-expect-error partial Response mock
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => rawSessions,
    });

    const { result } = renderHook(() => useChatSession('active-id'));

    // Initially loading becomes true inside effect, then false after fetch resolves
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.chatSessions).toHaveLength(2);
    expect(result.current.chatSessions[0].id).toBe('s1');
    expect(result.current.chatSessions[0].createdAt).toBeInstanceOf(Date);
    expect(result.current.chatSessions[1].firstMessage).toBeUndefined();

    // Ensure underlying fetch was called to /api/chat/sessions
    expect(global.fetch).toHaveBeenCalledWith('/api/chat/sessions');
  });
});

