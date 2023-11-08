import { redirect } from "next/navigation";

interface QuickViewDynamicPage {
  params: {
    productId: string;
  };
}

export default function QuickViewDynamicPage({ params }: QuickViewDynamicPage) {
  redirect(`/product/${params.productId}`);
}
