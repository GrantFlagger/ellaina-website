import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCT_SIZES } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, absoluteUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return PRODUCT_SIZES.map((size) => ({ slug: size.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const size = PRODUCT_SIZES.find((s) => s.id === params.slug);
  if (!size) return {};
  return pageMetadata({
    title: `${size.volume} Εξαιρετικό Παρθένο Ελαιόλαδο`,
    description: `${size.name.el} — Ellaina ${size.volume}: εξαιρετικό παρθένο ελαιόλαδο Κορωνέικης, ψυχρής έκθλιψης, από την Πρέβεζα. ${size.price}.`,
    path: `/shop/${size.id}`,
    image: `/og/products/${size.id}.jpg`,
    imageAlt: `Ellaina Extra Virgin Olive Oil ${size.volume}`,
  });
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const size = PRODUCT_SIZES.find((s) => s.id === params.slug);

  if (!size) {
    notFound();
  }

  const url = absoluteUrl(`/shop/${size.id}`);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Ellaina Extra Virgin Olive Oil ${size.volume}`,
      description: size.descriptor,
      sku: size.id,
      image: [absoluteUrl(size.image ?? `/og/products/${size.id}.jpg`)],
      brand: { "@type": "Brand", name: "Ellaina" },
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "EUR",
        price: size.priceNum.toFixed(2),
        itemCondition: "https://schema.org/NewCondition",
        // Static catalogue has no stock flag; switch to the DB `in_stock`
        // value if product pages start reading from InsForge.
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: SITE_NAME },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Αρχική", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Κατάστημα", item: absoluteUrl("/shop") },
        { "@type": "ListItem", position: 3, name: size.volume, item: url },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <main>
        <ProductDetail size={size} />
      </main>
    </>
  );
}
