import { notFound } from "next/navigation";
import { PRODUCT_SIZES } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return PRODUCT_SIZES.map((size) => ({ slug: size.id }));
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const size = PRODUCT_SIZES.find((s) => s.id === params.slug);

  if (!size) {
    notFound();
  }

  return <ProductDetail size={size!} />;
}