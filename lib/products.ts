export type ProductSize = {
  id:          string;
  name:        { el: string; en: string };
  volume:      string;
  price:       string;
  priceNum:    number;
  descriptor:  string;
  image:       string | null; // null = use styled placeholder (no photo yet)
};

// Row shape returned by the InsForge `products` table.
export type DbProduct = {
  id:         string;
  slug:       string;
  name:       string;
  volume:     string;
  price:      number;
  currency:   string;
  descriptor: string | null;
  image:      string | null;
  in_stock:   boolean;
  sort_order: number;
};

export function dbProductToSize(p: DbProduct): ProductSize {
  return {
    id:         p.slug,
    // The DB currently stores a single name string — used for both languages
    // until the `products` table gets its own el/en columns.
    name:       { el: p.name, en: p.name },
    volume:     p.volume,
    price:      `€${p.price.toFixed(2)}`,
    priceNum:   p.price,
    descriptor: p.descriptor ?? "",
    image:      p.image,
  };
}

export const PRODUCT_SIZES: ProductSize[] = [
    {
    id:         "500ml",
    name:       { el: "Καθημερινή Επιλογή", en: "Everyday Choice" },
    volume:     "500 ml",
    price:      "€13.00",
    priceNum:   13,
    descriptor: "Balanced flavour with a rich olive aroma. Perfect for everyday use at the table.",
    image:      "/images/bottle-warm.png",
  },
  {
    id:         "750ml",
    name:       { el: "Οικογενειακή Επιλογή", en: "Family Choice" },
    volume:     "750 ml",
    price:      "€17.00",
    priceNum:   17,
    descriptor: "Full of character with a smooth texture and fruity aftertaste. The ideal size for families.",
    image:      "/images/bottle-classic.png",
  },
  {
    id:         "5L",
    name:       { el: "Επιλογή του Σεφ", en: "Chef's Choice" },
    volume:     "5 L",
    price:      "€50.00",
    priceNum:   50,
    descriptor: "Professional-grade extra virgin olive oil in a large-format tin, built for demanding kitchens and generous cooking. The choice of chefs who never stop.",
    image:      "/images/ellaina_can.png",
  },
];