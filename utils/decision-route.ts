import type { DecisionRecord } from '@/types/decision';

export function serializeDecisionRecord(decision: DecisionRecord): string {
  return JSON.stringify(decision);
}

export function parseDecisionRecord(value: string | string[] | undefined): DecisionRecord | null {
  if (!value || Array.isArray(value)) {
    return null;
  }

  try {
    return JSON.parse(value) as DecisionRecord;
  } catch {
    return null;
  }
}
