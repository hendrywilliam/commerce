import type {
    CartLineDetailedItems,
    UploadData,
    ProductWithQuantity,
} from "@/types";
import { z } from "zod";
import { toast } from "sonner";
import { baseUrl } from "@/config/site";
import { twMerge } from "tailwind-merge";
import { UTApi } from "uploadthing/server";
import { User } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { subscriptionPlans } from "@/config/billing";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getErrorMessage(err: unknown) {
    const unknownError = "Something went wrong please try again later.";
    return err instanceof Error ? err.message : unknownError;
}

export function catchError(err: unknown) {
    const unknownError = "Something went wrong please try again later.";
    if (err instanceof z.ZodError) {
        return toast.error(err.issues[0].message);
    }
    if (isClerkAPIResponseError(err)) {
        return toast.error(err.errors[0].message ?? err.errors[0].longMessage);
    }
    if (err instanceof Error) {
        return toast.error(err.message);
    }
    return toast.error(unknownError);
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        currencyDisplay: "narrowSymbol",
    }).format(amount);
}

export function truncate(word: string, maxLength: number = 10) {
    return word.length >= maxLength
        ? word.substring(0, maxLength) + "..."
        : word;
}

export function slugify(value: string) {
    return value
        .replace(/[^A-Za-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
}

export function getPrimaryEmail(user: User) {
    return user.emailAddresses[0].emailAddress;
}

export function getAbsoluteUrl(segments: string) {
    if (segments.startsWith("/")) {
        return `${baseUrl}${segments}`;
    }
    return `${baseUrl}/${segments}`;
}

export function unixToDateString(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleDateString("us-US", {
        dateStyle: "full",
    });
}

export function beautifyId(id: string) {
    return id.split("_")[1];
}

export function calculateOrderAmounts(
    checkoutItems: CartLineDetailedItems[] | ProductWithQuantity[]
) {
    const PLATFORM_FEE_IN_DECIMAL = 0.01;
    const CENTS_UNIT_IN_DOLLAR = 100;
    const total =
        checkoutItems.reduce(
            (total, item) => total + item.qty * Number(item.price),
            0
        ) * CENTS_UNIT_IN_DOLLAR;
    const fee = total * PLATFORM_FEE_IN_DECIMAL;

    return {
        totalAmount: total,
        feeAmount: fee,
    };
}

export function centsToDollars(amount: string | number) {
    const CENTS_UNIT_IN_DOLLAR = 100;
    return typeof amount === "string"
        ? Number(amount) / CENTS_UNIT_IN_DOLLAR
        : amount / CENTS_UNIT_IN_DOLLAR;
}

export async function deleteImages(images: UploadData[]) {
    const utapi = new UTApi();
    const imageFileKeys = images.map((image) => image.key);
    return await utapi.deleteFiles(imageFileKeys);
}

export function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

export function getSubscriptionPlan(subscriptionId: string) {
    return (
        subscriptionPlans.find((plan) => plan.id === subscriptionId) ??
        subscriptionPlans[0]
    );
}

// Type utils
export type OmitAndExtend<T, U extends keyof T, V extends {}> = Omit<T, U> & V;
// Omit is not giving us any hint, because the second generic parameter (K) is accepting "any" instead of key from (T).
export type TweakedOmit<T, U extends keyof T> = Omit<T, U>;
export type Extends<T extends any, U extends any> = T & U;
