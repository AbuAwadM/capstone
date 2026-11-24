import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import DropDown from "@/components/ui/DropDown";
import { AVAILABILITY_OPTIONS, CATEGORY_OPTIONS } from "../constants";

function ProductToolBox() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");

  return (
    <div className="flex flex-col px-1 gap-4 mb-6 md:flex-row md:items-center">
      <SearchBar
        className="flex-1"
        value={query}
        placeholder="Search products..."
        onChange={(event) => setQuery(event.target.value)}
      />
      {/* Filters */}
      <div className="flex gap-4">
        <DropDown
          className="flex-1 md:w-48 md:flex-none"
          value={category}
          options={CATEGORY_OPTIONS}
          placeholder="Filter by category"
          onChange={setCategory}
        />
        <DropDown
          className="flex-1 md:w-48 md:flex-none"
          value={availability}
          options={AVAILABILITY_OPTIONS}
          placeholder="Filter by availability"
          onChange={setAvailability}
        />
      </div>
    </div>
  );
}

export default ProductToolBox;
