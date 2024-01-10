export function formatCurrency(amount: number) {
  const formatAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(amount);

  const dollar = formatAmount.split(".")[0];
  return dollar;
}
