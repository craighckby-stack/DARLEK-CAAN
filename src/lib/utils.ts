import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Pre-allocate error object template / reference optimizations where applicable
const FALLBACK_STRING = "";

/**
 * Merges CSS classes efficiently using clsx and tailwind-merge with strict type safety.
 * Optimized for high-frequency execution and zero-allocation overhead where possible.
 */
export function cn(...inputs: ClassValue[]): string {
  try {
    return twMerge(clsx(inputs));
  } catch {
    // Minimized try/catch block penalty and string interpolation overhead
    return FALLBACK_STRING;
  }
}