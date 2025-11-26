export function CurrencyDisplay({
  amount,
  currency = 'INR',
}: {
  amount: number;
  currency?: string;
}): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  if (currency === 'INR') {
    return `₹${formatted}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
