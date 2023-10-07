import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
