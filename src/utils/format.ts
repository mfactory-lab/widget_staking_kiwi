const SI_SYMBOL = ['', 'K', 'M', 'G', 'T', 'P', 'E'];

export const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const longPriceFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 5,
});

export const feeFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 9,
});

export const formatPct = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const abbreviateNumber = (number: number, precision: number, trimZeros = false) => {
  const tier = (Math.log10(number) / 3) | 0;
  let scaled = number;
  const suffix = SI_SYMBOL[tier];
  if (tier > 0) {
    const scale = Math.pow(10, tier * 3);
    scaled = number / scale;
  }

  if (isNaN(scaled)) {
    return '';
  }
  const result = trimZeros ? Number(scaled.toFixed(precision)) : scaled.toFixed(precision);
  return result + (typeof suffix === 'string' ? suffix : '');
};

export const formatAmount = (val: number, precision = 5, abbr = true) =>
  abbr ? abbreviateNumber(val, precision) : val.toFixed(precision);

export const formatAndTrimAmount = (val: number, precision = 5, abbr = true) =>
  abbr ? abbreviateNumber(val, precision, true) : Number(val.toFixed(precision));

export function formatMoney(val: string | number): string {
  if (typeof val === 'undefined' || val === null || val === '') {
    return '';
  }

  val = val.toString();

  const decimalSeparator = val.lastIndexOf('.');

  let integerPart = decimalSeparator >= 0 ? val.slice(0, decimalSeparator) : val;
  let fractionalPart = decimalSeparator >= 0 ? val.slice(decimalSeparator + 1) : null;

  if (fractionalPart) {
    fractionalPart = fractionalPart.slice(0, 2).replace(/[^0-9]+/g, '');
    if (fractionalPart.length === 1) fractionalPart += '0';
  } else if (!fractionalPart) fractionalPart = '00';

  integerPart = integerPart.replace(/[^0-9]+/g, '');
  if (!integerPart) {
    integerPart = '0';
  }

  let formatted = '';
  for (let i = 0; i < integerPart.length; i++) {
    if (i !== 0 && i % 3 === 0) {
      formatted = integerPart[integerPart.length - i - 1] + ',' + formatted;
    } else {
      formatted = integerPart[integerPart.length - i - 1] + formatted;
    }
  }

  formatted += '.' + fractionalPart;

  return formatted;
}

export function isInt(n: string | number): boolean {
  return Number(n) === n && n % 1 === 0;
}

export function isInvalidFloat(n: string | number): boolean {
  return isNaN(Number(n));
}

export function isInvalidTime(n: string, p: string): boolean {
  const num = Number(n);
  if (!isInt(num) || isInvalidFloat(num)) return true;
  let max = 12;
  if (p == 'Year') max = 20;
  else if (p == 'Epoch') max = 365;

  return num < 1 || num > max;
}
