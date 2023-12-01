import { User } from "@clerk/nextjs/server";
import { siteConfig } from "@/config/site-config";
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
    stripeCustomerId: string;
    stripeSubscriptionid: string;
    stripeSubscriptionClientSecret: string;
  };
  privateMetadata: {
    plan: "Hobby" | "Pro" | "Enterprise";
    storeId: string[];
    addresses: number[];
  };
}

export interface BillingPlan {
  plan: (typeof siteConfig.billingPlan)[0];
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
