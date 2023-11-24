import { User } from "@clerk/nextjs/server";
import { siteConfig } from "@/config/site-config";
import type { FileWithPath } from "@uploadthing/react";

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

export interface UserObjectCustomized extends Omit<User, "privateMetadata"> {
  privateMetadata: {
    plan: "Hobby" | "Pro" | "Enterprise";
    storeId: string[];
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
