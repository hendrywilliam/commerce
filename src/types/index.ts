import Stripe from "stripe";
import { User } from "@clerk/nextjs/server";
import { subscriptionPlans } from "@/config/billing";
import { NewProduct, Product } from "@/db/schema";
import type { Extends, OmitAndExtend } from "@/lib/utils";

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
  stock: number;
  storeId: number;
  category: string;
  storeName: string;
  storeSlug: string;
}

export type ProductWithQuantity = Extends<
  Product,
  { qty: number; user_has_comment?: boolean; user_comment_id?: number | string }
>;

export interface UserObjectCustomized
  extends Omit<User, "privateMetadata" | "publicMetadata"> {
  publicMetadata: {
    address: number;
  };
  privateMetadata: {
    plan: "Hobby" | "Pro" | "Enterprise";
    storeId: string[];
    stripeCustomerId: string;
    subscribedPlanId: string;
    stripeSubscriptionId: string;
    newsletterSubscriptionId?: number;
  };
}

export type BillingPlan = (typeof subscriptionPlans)[0];

export interface FileWithPreview extends File {
  preview: string;
}

export interface SortFilterItem {
  title: string;
  sortKey: string;
  reverse: boolean;
}

export interface PaymentIntentMetadata {
  metadata: {
    email: string;
    cartId: string;
    userId: string;
    storeId: number;
    checkoutItem: string;
  };
}

export interface CheckoutSessionCompletedMetadata {
  metadata: { clerkUserId: string };
}

export interface CustomerObjectMetadata
  extends OmitAndExtend<
    Stripe.Customer,
    "metadata",
    { metadata: { clerkId: string } }
  > {}

export type UploadData = {
  key: string;
  url: string;
  name: string;
  size: number;
};

export type ProductFormData = OmitAndExtend<
  NewProduct,
  "storeId" | "createdAt" | "id" | "slug" | "category",
  { category: NewProduct["category"] | string }
>;
