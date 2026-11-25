// Not stored — worked out from `stock` (see getStockStatus).
export type ProductStatus = "active" | "low-stock" | "out-of-stock";

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  visibleToAi: boolean;
  category: string;
};
