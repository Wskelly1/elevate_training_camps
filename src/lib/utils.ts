import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for combining CSS classes with conflict resolution
 *
 * This function combines multiple CSS class values using clsx for conditional
 * class application and tailwind-merge for resolving Tailwind CSS conflicts.
 * It's used throughout the application for dynamic class name generation.
 *
 * @param {...ClassValue[]} inputs - CSS class values to combine
 * @returns {string} Merged CSS class string with conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
