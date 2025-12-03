export const RUPEE_SYMBOL = '₹';
export const RUPEE_UNICODE = '\u20B9';

export function formatIndianNumber(amount: number, preserveDecimals: boolean = true): string {
  const hasDecimals = !Number.isInteger(amount);
  
  if (preserveDecimals && hasDecimals) {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  if (preserveDecimals) {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatPrice(amount: number, preserveDecimals: boolean = true): { symbol: string; value: string; full: string } {
  const formattedValue = formatIndianNumber(amount, preserveDecimals);
  return {
    symbol: RUPEE_SYMBOL,
    value: formattedValue,
    full: `${RUPEE_SYMBOL}${formattedValue}`,
  };
}

export function formatPriceRange(min: number, max: number, preserveDecimals: boolean = true): string {
  return `${RUPEE_SYMBOL}${formatIndianNumber(min, preserveDecimals)} - ${RUPEE_SYMBOL}${formatIndianNumber(max, preserveDecimals)}`;
}

export function formatDiscount(type: 'percentage' | 'fixed' | 'bogo', value: number, preserveDecimals: boolean = true): { display: string; needsRupee: boolean } {
  switch (type) {
    case 'percentage':
      return { display: `${value}%`, needsRupee: false };
    case 'fixed':
      return { display: formatIndianNumber(value, preserveDecimals), needsRupee: true };
    case 'bogo':
      return { display: 'BOGO', needsRupee: false };
    default:
      return { display: String(value), needsRupee: false };
  }
}
