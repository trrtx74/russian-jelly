// import { useMemo } from 'react';
import { Agent } from './agent';

// Singleton Pattern:
// We create one instance outside of the React lifecycle.
// This ensures that:
// 1. We only allocate memory for the agent once.
// 2. The 'beliefCache' is preserved across component unmounts/remounts.
// 3. We avoid any re-initialization overhead during re-renders.
const globalAgent = new Agent();

export function useAgent() {
  // Since the agent is stateless (except for the computation cache),
  // we can simply return the global instance.
  // Using a hook allows for future extensibility (e.g. accessing Context)
  // without changing the call sites.
  return globalAgent;
}
