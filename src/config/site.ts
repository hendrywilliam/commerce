import { IconStores, IconPayment, IconAnalytics } from "@/components/ui/icons";
import * as dotenv from "dotenv";
dotenv.config();

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const footerNavigation = [
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
];

export const dashboardNavigation = [
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
];
