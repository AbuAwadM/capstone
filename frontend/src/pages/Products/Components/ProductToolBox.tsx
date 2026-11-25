import SearchBar from "@/components/ui/SearchBar";
import DropDown from "@/components/ui/DropDown";
import { AVAILABILITY_OPTIONS, CATEGORY_OPTIONS } from "../constants";
import type { ProductFilters } from "../utils";

interface ProductToolBoxProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

function ProductToolBox({ filters, onFiltersChange }: ProductToolBoxProps) {
  function updateFilter<K extends keyof ProductFilters>(field: K, value: ProductFilters[K]) {
    onFiltersChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-col px-1 gap-4 mb-6 md:flex-row md:items-center">
      <SearchBar
        className="flex-1"
        value={filters.query}
        placeholder="Search products..."
        onChange={(event) => updateFilter("query", event.target.value)}
      />
      {/* Filters */}
      <div className="flex gap-4">
        <DropDown
          className="flex-1 md:w-48 md:flex-none"
          value={filters.category}
          options={CATEGORY_OPTIONS}
          placeholder="Filter by category"
          onChange={(category) => updateFilter("category", category)}
        />
        <DropDown
          className="flex-1 md:w-48 md:flex-none"
          value={filters.availability}
          options={AVAILABILITY_OPTIONS}
          placeholder="Filter by availability"
          onChange={(availability) => updateFilter("availability", availability)}
        />
      </div>
    </div>
  );
}

export default ProductToolBox;
