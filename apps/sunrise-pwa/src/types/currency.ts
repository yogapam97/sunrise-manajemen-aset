export type Currency = {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
};

// Define the default currency object
export const defaultCurrency: Currency = {
  symbol: "$",
  name: "US Dollar",
  symbol_native: "$",
  decimal_digits: 2,
  rounding: 0,
  code: "USD",
  name_plural: "US dollars",
};
