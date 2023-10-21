import { User } from "@clerk/nextjs/server";
import { siteConfig } from "@/config/site-config";

export interface CartItem {
  id: number;
  qty: number;
}

// remove default prop provided by third party -> own property
export interface UserObjectCustomized extends Omit<User, "privateMetadata"> {
  privateMetadata: {
    storeId: string[];
  };
}

export interface BillingPlan {
  plan: (typeof siteConfig.billingPlan)[0];
}
