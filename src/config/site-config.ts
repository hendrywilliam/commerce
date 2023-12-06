import {
  IconStores,
  IconCalendar,
  IconPayment,
  IconAnalytics,
} from "@/components/ui/icons";
import { SortFilterItem } from "@/types";
import * as dotenv from "dotenv";

dotenv.config();

export const siteConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  footerNavigation: [
    {
      title: "My fav lofis",
      items: [
        {
          title: "lofi girl halloween",
          href: "https://www.youtube.com/watch?v=ULQhvIGG27Q&pp=ygUJbG9maSBnaXJs",
        },
        {
          title: "synthwave boy",
          href: "https://www.youtube.com/watch?v=4xDzrJKXOOY&pp=ygUJc3ludGh3YXZl",
        },
        {
          title: "lofi girl",
          href: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        },
        {
          title: "beats to sleep/chill to",
          href: "https://www.youtube.com/watch?v=rUxyKA_-grg&pp=ygUJbG9maSBnaXJs",
        },
      ],
    },
    {
      title: "Socials",
      items: [
        {
          title: "github",
          href: "https://github.com/hendrywilliam",
        },
      ],
    },
  ],
  dashboardNavigation: [
    {
      title: "Stores",
      href: "/dashboard/stores",
      icon: IconStores,
      description: "Manage your own stores, or create a brand new store.",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: IconPayment,
      description: "Manage your billing plan.",
    },
    {
      title: "Purchase",
      href: "/dashboard/purchases",
      icon: IconAnalytics,
      description: "Gather information based on your purchase data.",
    },
  ],
  billingPlan: [
    {
      id: "price_1OICDUAaT0py2Y5OeeHaAGG0",
      title: "Hobby",
      description:
        "Hobby tier can only create 5 stores. Great for small business owner",
      limit: 5,
      price: 0,
    },
    {
      id: "price_1OIC7EAaT0py2Y5O7oG6MdDg",
      title: "Pro",
      description:
        "Everything in hobby, plus 10 stores. Great choice for medium-to-big business owner.",
      limit: 15,
      price: 20,
    },
    {
      id: "price_1OICBxAaT0py2Y5OIO5ve8JO",
      title: "Enterprise",
      description:
        "Everything in pro, plus 10 stores. What colour is your bugatti?",
      limit: 25,
      price: 100,
    },
  ],
  sortingProductsItem: [
    {
      title: "Date: Oldest to Newest",
      sortKey: "createdAt",
      reverse: false,
    },
    {
      title: "Date: Newest to Oldest",
      sortKey: "createdAt",
      reverse: true,
    },
    {
      title: "Price: Low to High",
      sortKey: "price",
      reverse: false, // ASC
    },
    {
      title: "Price: High to Low",
      sortKey: "price",
      reverse: true,
    },
    {
      title: "Alphabetical: A - Z",
      sortKey: "name",
      reverse: false, // ASC
    },
    {
      title: "Alphabetical: Z - A",
      sortKey: "name",
      reverse: true,
    },
  ] satisfies SortFilterItem[],
  productCategories: [
    {
      id: 1,
      title: "Clothing",
      value: "clothing",
    },
    {
      id: 2,
      title: "Backpack",
      value: "backpack",
    },
    {
      id: 3,
      title: "Shoes",
      value: "shoes",
    },
  ],
  rowsPerPage: [
    {
      title: "10",
      value: "10",
    },
    {
      title: "20",
      value: "20",
    },
    {
      title: "30",
      value: "30",
    },
    {
      title: "40",
      value: "40",
    },
    {
      title: "50",
      value: "50",
    },
  ],
};
