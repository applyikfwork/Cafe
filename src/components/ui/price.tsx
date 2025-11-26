import { RupeeSymbol } from './rupee-symbol';

interface PriceProps {
  amount: number;
  className?: string;
}

export function Price({ amount, className = '' }: PriceProps) {
  return (
    <span className={`price-display ${className}`}>
      <RupeeSymbol />
      {new Intl.NumberFormat('en-IN').format(amount)}
    </span>
  );
}
