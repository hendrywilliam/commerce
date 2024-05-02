import { siteStaticMetadata } from "@/config/site";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: "Overview — Dashboard",
    description: "Overview of your stores, products, incomes, orders.",
    ...siteStaticMetadata,
  };
}

export default async function DashboardPage() {
  return (
    <div className="h-full">
      <p>ok</p>
    </div>
  );
}
