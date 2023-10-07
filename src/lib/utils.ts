import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { isClerkAPIResponseError } from "@clerk/nextjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const logger = {
  error: function (message: any) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Error]", message);
    }
  },
  log: function (message: any) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Log]", message);
    }
  },
};

export function catchError(err: unknown) {
  const unknownErorr = "Something went wrong please try again later.";
  if (isClerkAPIResponseError(err)) {
    toast.error(err.errors[0].longMessage ?? unknownErorr);
  } else {
    toast.error(unknownErorr);
  }
}
