import { IconStores, IconPayment, IconAnalytics } from "@/components/ui/icons";
import * as dotenv from "dotenv";
dotenv.config();

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const siteName = "commerce";

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

export const navigationMenu: {
  [key: string]: {
    title: string;
    href: string;
    description: string;
  }[];
} = {
  clothing: [
    {
      title: "Low Price",
      href: "/products?category=clothing&pmax=100",
      description: "Browse clothing products with low prices.",
    },
    {
      title: "High Price",
      href: "/products?category=clothing&pmin=100",
      description: "Browse clothing products with high prices.",
    },
  ],
  backpack: [
    {
      title: "High Rating",
      href: "/products?category=backpack&rating=4",
      description: "Browse backpack products with highest rating.",
    },
    {
      title: "Low Price",
      href: "/products?category=backpack&pmax=100",
      description:
        "Save more. Discover our top picks for high-quality items at low prices.",
    },
    {
      title: "High Price",
      href: "/products?category=backpack&pmin=100",
      description:
        "Shop our top-tier items for the best in quality and style, perfect for those who love a little luxury",
    },
  ],
  shoes: [
    {
      title: "Low Price",
      href: "/products?category=shoes&pmax=100",
      description: "Snag a great deal on stylish shoes without spending a lot.",
    },
    {
      title: "High Price",
      href: "/products?category=shoes&pmin=100",
      description: "Browse premium shoes for high-quality finds.",
    },
  ],
};

export const siteStaticMetadata = {
  applicationName: "commerce by hendryw",
  keywords: [
    "Next.js",
    "React.js",
    "Typescript",
    "Stripe",
    "Payment",
    "Commerce",
  ],
  authors: [
    {
      name: "Hendry William",
      url: "https://github.com/hendrywilliam",
    },
  ],
  creator: "Hendry William",
};
