import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { isClerkAPIResponseError } from "@clerk/nextjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function catchError(err: unknown) {
  const unknownError = "Something went wrong please try again later.";
  if (isClerkAPIResponseError(err)) {
    toast.error(err.errors[0].longMessage ?? unknownError);
  } else if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error(unknownError);
  }
}

export function formatCurrency(amount: number) {
  const formatAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(amount);

  const dollar = formatAmount.split(".")[0];
  return dollar;
}

export function truncate(word: string, maxLength: number = 10) {
  return word.length >= maxLength ? word.slice(0, maxLength) + "..." : word;
}
