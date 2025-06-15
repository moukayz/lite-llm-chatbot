import { useState } from "react";

export function useControlledState<T>(initialValue: T, controlledValue: T | null | undefined) {
  const [innerValue, setInnerValue] = useState(initialValue);
  const [outerValue, setOuterValue] = useState<T | null | undefined>(null);

  if (outerValue !== controlledValue && controlledValue !== null && controlledValue !== undefined) {
    setOuterValue(controlledValue);
    setInnerValue(controlledValue);
  }

  return [innerValue, setInnerValue] as const;
}