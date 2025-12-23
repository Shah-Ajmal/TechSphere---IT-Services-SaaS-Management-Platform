import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// Helper to convert HSL color variables to Tailwind classes
export function hslVar(variable) {
  return `hsl(var(--color-${variable}))`;
}
