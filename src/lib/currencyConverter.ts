export type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "CAD" | "AUD";

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = X Currency
}

export const fontMap: Record<CurrencyCode, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  CAD: "CA$",
  AUD: "A$",
};

export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.77,
  CAD: 1.36,
  AUD: 1.5,
};

export function formatCurrency(
  amountInUSD: number,
  targetCurrency: CurrencyCode = "USD"
): string {
  const rate = CURRENCY_RATES[targetCurrency] || 1.0;
  const converted = amountInUSD * rate;
  const symbol = fontMap[targetCurrency] || "$";

  if (targetCurrency === "INR") {
    if (converted >= 100000) {
      const lakhs = (converted / 100000).toFixed(1);
      return `${symbol}${lakhs} Lakhs`;
    }
    return `${symbol}${Math.round(converted).toLocaleString("en-IN")}`;
  }

  return `${symbol}${Math.round(converted).toLocaleString()}`;
}
