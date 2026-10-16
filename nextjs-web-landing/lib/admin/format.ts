export function formatMinorAed(minor: number | null | undefined): string {
  const value = (minor || 0) / 100;
  return `AED ${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatMoney(amount: number, currency: string): string {
  const value = (amount || 0) / 100;
  const code = (currency || "AED").toUpperCase();
  return `${code} ${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatWhen(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
