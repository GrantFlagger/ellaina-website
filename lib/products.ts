export type ProductSize = {
  id:          string;
  name:        string;
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
    name:       p.name,
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
    name:       "Bottle",
    volume:     "500 ml",
    price:      "€13.00",
    priceNum:   13,
    descriptor: "Balanced flavour with a rich olive aroma. Perfect for everyday use at the table.",
    image:      "/images/bottle-warm.png",
  },
  {
    id:         "750ml",
    name:       "Bottle",
    volume:     "750 ml",
    price:      "€17.00",
    priceNum:   17,
    descriptor: "Full of character with a smooth texture and fruity aftertaste. The ideal size for families.",
    image:      "/images/bottle-classic.png",
  },
  {
    id:         "5L",
    name:       "Litre Can",
    volume:     "5 L",
    price:      "€50.00",
    priceNum:   50,
    descriptor: "Premium extra virgin olive oil in a family-size tin. The perfect choice for bulk use and great value.",
    image:      null,
  },
];
