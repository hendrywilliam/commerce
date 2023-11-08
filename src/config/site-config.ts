import {
  IconStores,
  IconCalendar,
  IconPayment,
  IconAnalytics,
} from "@/components/ui/icons";
import { SortFilterItem } from "@/types";

export const siteConfig = {
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
      id: 1,
      title: "Hobby",
      description:
        "Hobby tier can only create 5 stores. Great for small business owner",
      limit: 5,
      price: 0,
    },
    {
      id: 2,
      title: "Pro",
      description:
        "Everything in hobby, plus 10 stores. Great choice for medium-to-big business owner.",
      limit: 15,
      price: 20,
    },
    {
      id: 3,
      title: "Enterprise",
      description: "Everything in pro, plus 10 stores.",
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
      title: "Price: Low to High",
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
};
