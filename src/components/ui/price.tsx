interface PriceProps {
  amount: number;
  className?: string;
}

export function Price({ amount, className = '' }: PriceProps) {
  return (
    <span className={`price-display ${className}`} suppressHydrationWarning>
      <span className="rupee-symbol" suppressHydrationWarning>₹</span>
      <span suppressHydrationWarning>{new Intl.NumberFormat('en-IN').format(amount)}</span>
    </span>
  );
}
