import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logger() {
  if (process.env.NODE_ENV === "production") {
    return;
  } else {
    return {
      error: function (message: string) {
        console.error(`[Error] ${message}`);
      },
      log: function (message: string) {
        console.log(`[Log] ${message}`);
      },
    };
  }
}
