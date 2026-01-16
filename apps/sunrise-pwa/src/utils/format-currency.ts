export default function formatCurrency(
  value: number,
  locale: string = "en-US",
  currency: string = "USD"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
