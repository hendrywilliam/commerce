import { User } from "@clerk/nextjs/server";
import { billingPlan } from "@/config/billing";
import type { OmitAndExtend, TweakedOmit } from "@/lib/utils";
import type { FileWithPath } from "@uploadthing/react";
import Stripe from "stripe";

export interface CartItem {
  id: number;
  qty: number;
}

export interface CartLineDetailedItems {
  id: number;
  qty: number;
  name: string;
  price: string;
  image: string;
  storeId: number;
  category: string;
  storeName: string;
  storeSlug: string;
}

export interface UserObjectCustomized
  extends Omit<User, "privateMetadata" | "publicMetadata"> {
  publicMetadata: {
    address: number;
  };
  privateMetadata: {
    plan: "Hobby" | "Pro" | "Enterprise";
    storeId: string[];
    stripeCustomerId: string;
    stripeSubscriptionId: string;
  };
}

export interface BillingPlan {
  plan: {
    [Key in keyof (typeof billingPlan)[0]]: (typeof billingPlan)[0][Key];
  };
}

export interface FileWithPreview extends FileWithPath {
  preview: string;
}

export interface SortFilterItem {
  title: string;
  sortKey: string;
  reverse: boolean;
}

export interface PaymentIntentMetadata {
  metadata: {
    storeId: number;
    cartId: string;
    checkoutItem: string;
    email: string;
  };
}

export interface CheckoutSessionCompletedMetadata {
  metadata: {
    clerkUserId: string;
  };
}

export interface CustomerObjectMetadata
  extends OmitAndExtend<
    Stripe.Customer,
    "metadata",
    {
      metadata: {
        clerkId: string;
      };
    }
  > {}

export type UploadFileResponse =
  | { data: UploadData; error: null }
  | { data: null; error: UploadError };

export type UploadData = {
  key: string;
  url: string;
  name: string;
  size: number;
};

export type UploadError = {
  code: string;
  message: string;
  data: any;
};
