'use client';

import { formatIndianNumber, RUPEE_SYMBOL } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface CurrencyProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
  preserveDecimals?: boolean;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export function Currency({ amount, className = '', showSymbol = true, preserveDecimals = true, size }: CurrencyProps) {
  const formattedValue = formatIndianNumber(amount, preserveDecimals);
  
  const sizeClasses = size ? `text-${size}` : '';
  
  return (
    <span className={cn('currency-wrapper', sizeClasses, className)} suppressHydrationWarning>
      {showSymbol && (
        <span className="rupee-symbol" suppressHydrationWarning aria-label="Indian Rupees">
          {RUPEE_SYMBOL}
        </span>
      )}
      <span className="currency-value" suppressHydrationWarning>{formattedValue}</span>
    </span>
  );
}

interface RupeeProps {
  className?: string;
}

export function Rupee({ className = '' }: RupeeProps) {
  return (
    <span className={cn('rupee-symbol', className)} suppressHydrationWarning aria-label="Indian Rupees">
      {RUPEE_SYMBOL}
    </span>
  );
}

interface DiscountBadgeProps {
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  className?: string;
  suffix?: string;
}

export function DiscountBadge({ type, value, className = '', suffix = '' }: DiscountBadgeProps) {
  if (type === 'percentage') {
    return (
      <span className={cn('discount-badge', className)} suppressHydrationWarning>
        {value}%{suffix && ` ${suffix}`}
      </span>
    );
  }
  
  if (type === 'bogo') {
    return (
      <span className={cn('discount-badge', className)} suppressHydrationWarning>
        BOGO{suffix && ` ${suffix}`}
      </span>
    );
  }
  
  return (
    <span className={cn('discount-badge currency-wrapper', className)} suppressHydrationWarning>
      <span className="rupee-symbol" suppressHydrationWarning>{RUPEE_SYMBOL}</span>
      <span className="currency-value" suppressHydrationWarning>{formatIndianNumber(value, true)}</span>
      {suffix && <span suppressHydrationWarning> {suffix}</span>}
    </span>
  );
}

interface PriceRangeProps {
  min: number;
  max: number;
  className?: string;
  preserveDecimals?: boolean;
}

export function PriceRange({ min, max, className = '', preserveDecimals = true }: PriceRangeProps) {
  return (
    <span className={cn('price-range currency-wrapper', className)} suppressHydrationWarning>
      <Currency amount={min} preserveDecimals={preserveDecimals} />
      <span suppressHydrationWarning> - </span>
      <Currency amount={max} preserveDecimals={preserveDecimals} />
    </span>
  );
}

interface PrizeAmountProps {
  amount: number;
  className?: string;
  preserveDecimals?: boolean;
}

export function PrizeAmount({ amount, className = '', preserveDecimals = true }: PrizeAmountProps) {
  return (
    <span className={cn('prize-amount currency-wrapper', className)} suppressHydrationWarning>
      <span className="rupee-symbol" suppressHydrationWarning>{RUPEE_SYMBOL}</span>
      <span className="currency-value" suppressHydrationWarning>{formatIndianNumber(amount, preserveDecimals)}</span>
    </span>
  );
}
