import { User } from "@clerk/nextjs/server";
import { billingPlan } from "@/config/billing";
import type { FileWithPath } from "@uploadthing/react";
import { UploadFileResponse } from "uploadthing/client";

export interface CartItem {
  id: number;
  qty: number;
}

export interface CartLineDetailedItems {
  id: number;
  name: string;
  price: string;
  category: string;
  storeId: number;
  storeName: string;
  image: string;
  qty: number;
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

// fileUrl, fileName, ...rest is deprecated.
export type ProductImage = Pick<
  UploadFileResponse,
  "key" | "name" | "size" | "url"
>;
