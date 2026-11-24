import { useState } from "react";
import Toggle from "@/components/ui/Toggle";
import dummyProducts from "@/data/dummyProducts.json";
import type { Product, ProductStatus } from "@/types/product";

// Placeholder data — replace with the response from the FastAPI endpoint.
const PRODUCTS = dummyProducts as Product[];

const COLUMNS = ["Product", "Price", "Stock", "Visible to AI", "Status"];

// At or below this many units, a product counts as low stock.
const LOW_STOCK_THRESHOLD = 25;

function getStockStatus(stock: number): ProductStatus {
  if (stock === 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "active";
}

// Badge and stock-bar colours share one entry per status so they always match.
const STATUS_STYLES: Record<
  ProductStatus,
  { label: string; badgeClassName: string; barClassName: string }
> = {
  active: {
    label: "Active",
    badgeClassName: "bg-green-100 text-green-800",
    barClassName: "bg-green-500",
  },
  "low-stock": {
    label: "Low Stock",
    badgeClassName: "bg-amber-100 text-amber-800",
    barClassName: "bg-amber-500",
  },
  "out-of-stock": {
    label: "Out of Stock",
    badgeClassName: "bg-red-100 text-red-800",
    barClassName: "bg-red-500",
  },
};

// TODO: Should be global
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function StockBar({ stock, maxStock }: { stock: number; maxStock: number }) {
  const ratio = maxStock > 0 ? stock / maxStock : 0;
  const color = STATUS_STYLES[getStockStatus(stock)].barClassName;

  return (
    <div className="flex items-center gap-3">
      {/* Decorative — the number beside it carries the value for screen readers. */}
      <div
        aria-hidden="true"
        className="w-24 h-2 overflow-hidden bg-gray-200 rounded-full"
      >
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className={stock === 0 ? "text-red-600 font-medium" : ""}>
        {stock}
      </span>
    </div>
  );
}

interface ProductTableRowProps {
  product: Product;
  maxStock: number;
  isSelected: boolean;
  onSelect: (product: Product) => void;
  onToggleVisibleToAi: (id: string, visible: boolean) => void;
}

function ProductTableRow({
  product,
  maxStock,
  isSelected,
  onSelect,
  onToggleVisibleToAi,
}: ProductTableRowProps) {
  const status = STATUS_STYLES[getStockStatus(product.stock)];

  return (
    <tr
      tabIndex={0}
      aria-selected={isSelected}
      onClick={() => onSelect(product)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(product);
        }
      }}
      className={`border-b border-gray-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
        isSelected ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
      <td className="px-4 py-3">{priceFormatter.format(product.price)}</td>
      <td className="px-4 py-3">
        <StockBar stock={product.stock} maxStock={maxStock} />
      </td>
      {/* Stop clicks/keys here so flipping the switch doesn't also select the row. */}
      <td
        className="px-4 py-3"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Toggle
          checked={product.visibleToAi}
          label={`Show ${product.name} to AI`}
          onChange={(visible) => onToggleVisibleToAi(product.id, visible)}
        />
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.badgeClassName}`}
        >
          {status.label}
        </span>
      </td>
    </tr>
  );
}

function ProductTable() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [tableRows, setTableRows] = useState<ProductTableRowProps[]>([]);

  function handleToggleVisibleToAi(id: string, visible: boolean) {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, visibleToAi: visible } : product,
      ),
    );
  }

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  function handleSelectProduct(product: Product) {
    setSelectedProductId(product.id);
    // TODO: open the product details (page or side panel) here.
  }

  const maxStock = Math.max(0, ...products.map((product) => product.stock));

  return (
    <div className="flex-1 min-h-0 overflow-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="sticky top-0 z-10 text-gray-500 bg-gray-50">
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-3 font-medium whitespace-nowrap"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-4 py-12 text-center text-gray-400"
              >
                No products yet.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                maxStock={maxStock}
                isSelected={product.id === selectedProductId}
                onSelect={handleSelectProduct}
                onToggleVisibleToAi={handleToggleVisibleToAi}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
