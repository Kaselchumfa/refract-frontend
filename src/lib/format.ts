/** Shared number/currency formatting helpers used across pages. */

const USDC_DECIMALS = 7;

/** Converts a human USDC amount (e.g. 5000) to the integer base-unit string the backend expects (1e7 per USDC). */
export function toStroops(amount: number): string {
  return BigInt(Math.round(amount * 10 ** USDC_DECIMALS)).toString();
}

/** Converts a base-unit string (1e7 per USDC) back to a human float. */
export function fromStroops(value: string | number): number {
  return Number(value) / 10 ** USDC_DECIMALS;
}

/**
 * Parses a user-entered money string into a finite number, or `null` when the
 * input is empty, whitespace, non-numeric, or otherwise not a usable amount.
 *
 * Unlike a bare `parseFloat`, this never returns `NaN` and never silently
 * accepts partial garbage (e.g. `"1e5"`, `"12abc"`, `"-5"`). Locale-formatted
 * input such as `"1,000.50"` is normalised before parsing.
 */
export function parseAmount(input: string): number | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (trimmed === "") return null;

  // Strip grouping separators (commas and spaces) so "1,000.50" parses cleanly.
  const normalised = trimmed.replace(/[,\s]/g, "");

  // Only allow an optional leading sign, digits, and a single decimal point.
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(normalised)) return null;

  const parsed = Number(normalised);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

export function formatUsd(value: number, opts: Intl.NumberFormatOptions = {}): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  });
}

export function formatCompactUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return formatUsd(value);
}

/** Renders a past timestamp (ms since epoch) as "3 days ago", "2 weeks ago", etc. */
export function formatRelativeTime(timestampMs: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - timestampMs) / 1000));
  const units: [string, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, secondsInUnit] of units) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
  }
  return "just now";
}
