import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { isClerkAPIResponseError } from "@clerk/nextjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function catchError(err: unknown) {
  const unknownErorr = "Something went wrong please try again later.";
  if (isClerkAPIResponseError(err)) {
    toast.error(err.errors[0].longMessage ?? unknownErorr);
  } else if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error(unknownErorr);
  }
}
