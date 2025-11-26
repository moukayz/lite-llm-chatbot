import { renderHook, act } from '@testing-library/react';
import { useControlledState } from '../useControlledState';

describe('useControlledState', () => {
  test('returns initial value when controlledValue is null/undefined and allows internal updates', () => {
    const { result } = renderHook(({ initial, controlled }) =>
      useControlledState(initial, controlled),
      { initialProps: { initial: 'A', controlled: null } }
    );

    expect(result.current[0]).toBe('A');

    act(() => {
      const [, setValue] = result.current;
      setValue('B');
    });

    expect(result.current[0]).toBe('B');
  });

  test('syncs with controlled value when provided and updates when controlled changes', () => {
    const { result, rerender } = renderHook(({ initial, controlled }) =>
      useControlledState(initial, controlled),
      { initialProps: { initial: 'A', controlled: null } }
    );

    // Provide controlled value
    rerender({ initial: 'A', controlled: 'C' });

    // After rerender, inner value should be synced to controlled
    expect(result.current[0]).toBe('C');

    // Change controlled value again
    rerender({ initial: 'A', controlled: 'D' });
    expect(result.current[0]).toBe('D');
  });

  test('allows manual updates even when controlled value is set', () => {
    const { result, rerender } = renderHook(({ initial, controlled }) =>
      useControlledState(initial, controlled),
      { initialProps: { initial: 'A', controlled: 'C' } }
    );

    // Controlled value applied on first render
    expect(result.current[0]).toBe('C');

    // Manually update inside
    act(() => {
      const [, setValue] = result.current;
      setValue('X');
    });

    expect(result.current[0]).toBe('X');

    // Rerender with same controlled value shouldn't override manual update
    rerender({ initial: 'A', controlled: 'C' });
    expect(result.current[0]).toBe('X');

    // Changing controlled value should override
    rerender({ initial: 'A', controlled: 'Y' });
    expect(result.current[0]).toBe('Y');
  });
});

