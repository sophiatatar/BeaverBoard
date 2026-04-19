/**
 * Fixed anchor for all seeded timestamps so server render and client hydration
 * produce identical markup (no Date.now() at import time).
 */
export const DEMO_ANCHOR_MS = 1_740_000_000_000;
