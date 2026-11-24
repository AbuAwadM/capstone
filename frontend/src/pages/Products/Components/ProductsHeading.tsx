import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import dummyDashboardStats from "@/data/dummyDashboardStats.json";
import type { Stat } from "@/types/dashboard";
import { VISIBLE_STAT_IDS } from "../constants";

// Placeholder data — replace with the response from the FastAPI endpoint.
const STATS: Stat[] = dummyDashboardStats;
const dataToShow = VISIBLE_STAT_IDS.flatMap((id) =>
  STATS.filter((stat) => stat.id === id),
);

interface ProductsHeadingProps {
  onNewProduct: () => void;
}

function ProductsHeading({ onNewProduct }: ProductsHeadingProps) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      {/* Title on the left, main action on the right */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Products
        </h1>
        <Button type="button" size="medium" onClick={onNewProduct}>
          <span className="flex items-center gap-1.5">
            <Plus size={16} aria-hidden="true" />
            Add Product
          </span>
        </Button>
      </div>
      {/* Show the visible statistics in a row */}
      <div className="flex flex-wrap gap-4">
        {dataToShow.map((stat) => (
          <span key={stat.id} className="text-sm font-medium text-gray-500">
            {stat.title}: <span className="text-gray-900">{stat.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProductsHeading;
