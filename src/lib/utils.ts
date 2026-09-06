import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional CSS class names using `clsx` and resolves Tailwind CSS class conflicts using `twMerge`.
 *
 * @param inputs - A variadic set of class values including strings, arrays, objects, or falsy values.
 * @returns A consolidated, conflict-free class string.
 */
export function cn(...inputs: ClassValue[]): string {
  try {
    return twMerge(clsx(inputs));
  } catch {
    return "";
  }
}