'use client';

import { formatIndianNumber, RUPEE_SYMBOL } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface PriceProps {
  amount: number;
  className?: string;
  preserveDecimals?: boolean;
}

export function Price({ amount, className = '', preserveDecimals = true }: PriceProps) {
  return (
    <span className={cn('price-display currency-wrapper', className)} suppressHydrationWarning>
      <span className="rupee-symbol" suppressHydrationWarning aria-label="Indian Rupees">
        {RUPEE_SYMBOL}
      </span>
      <span className="currency-value" suppressHydrationWarning>
        {formatIndianNumber(amount, preserveDecimals)}
      </span>
    </span>
  );
}
