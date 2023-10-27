import { User } from "@clerk/nextjs/server";
import { siteConfig } from "@/config/site-config";

export interface CartItem {
  id: number;
  qty: number;
}

export interface CartLineDetailedItems {
  id: number;
  name: string;
  price: string;
  category: string;
  storeName: string;
  qty: number;
}

export interface UserObjectCustomized extends Omit<User, "privateMetadata"> {
  privateMetadata: {
    storeId: string[];
  };
}

export interface BillingPlan {
  plan: (typeof siteConfig.billingPlan)[0];
}
