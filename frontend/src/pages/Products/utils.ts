import type { Product, ProductStatus } from "@/types/product";

// At or below this many units, a product counts as low stock.
const LOW_STOCK_THRESHOLD = 25;

export function getStockStatus(stock: number): ProductStatus {
  if (stock === 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "active";
}

// An empty string means "no filter" — it's the value of each control's placeholder.
export interface ProductFilters {
  query: string;
  category: string;
  availability: string;
}

export const EMPTY_FILTERS: ProductFilters = {
  query: "",
  category: "",
  availability: "",
};

export function filterProducts(
  products: Product[],
  { query, category, availability }: ProductFilters,
): Product[] {
  const search = query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesQuery = !search || product.name.toLowerCase().includes(search);
    const matchesCategory = !category || product.category === category;
    const matchesAvailability =
      !availability ||
      (availability === "in-stock" && product.stock > 0) ||
      (availability === "out-of-stock" && product.stock === 0);

    return matchesQuery && matchesCategory && matchesAvailability;
  });
}
