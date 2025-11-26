import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'INR') {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
  }).format(amount);

  if (currency === 'INR') {
    return `₹${formatted}`;
  }

  // Fallback for other currencies
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
