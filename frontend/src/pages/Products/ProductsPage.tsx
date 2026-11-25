import { useState } from "react";
import dummyProducts from "@/data/dummyProducts.json";
import type { Product } from "@/types/product";
import ProductsHeading from "./Components/ProductsHeading";
import ProductToolBox from "./Components/ProductToolBox";
import ProductTable from "./Components/ProductTable";
import ProductEditSidePanel from "./Components/ProductEditSidePanel";
import { EMPTY_FILTERS, filterProducts, type ProductFilters } from "./utils";

// Placeholder data — replace with the response from the FastAPI endpoint.
const INITIAL_PRODUCTS: Product[] = dummyProducts;

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);
  // null means the side panel is in "New Product" mode.
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const visibleProducts = filterProducts(products, filters);
  // Kept even when filters hide the row, so unsaved edits in the panel aren't lost.
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null;
  const maxStock = Math.max(0, ...products.map((product) => product.stock));

  function handleToggleVisibleToAi(id: string, visible: boolean) {
    // TODO: persist through the FastAPI endpoint.
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, visibleToAi: visible } : product,
      ),
    );
  }

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Main content — takes the remaining 70%; the table fills the leftover height and scrolls. */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <ProductsHeading onNewProduct={() => setSelectedProductId(null)} />
        <ProductToolBox filters={filters} onFiltersChange={setFilters} />
        <ProductTable
          products={visibleProducts}
          maxStock={maxStock}
          emptyMessage={
            products.length === 0 ? "No products yet." : "No products match your filters."
          }
          selectedProductId={selectedProductId}
          onSelect={setSelectedProductId}
          onToggleVisibleToAi={handleToggleVisibleToAi}
        />
      </div>
      {/* Side panel — fixed at 30% of the page width, fits the page height without scrolling. */}
      <aside className="w-[30%] shrink-0 overflow-hidden">
        {/* Remount per product so the form starts from that product's values. */}
        <ProductEditSidePanel key={selectedProduct?.id ?? "new"} product={selectedProduct} />
      </aside>
    </div>
  );
}

export default ProductsPage;
