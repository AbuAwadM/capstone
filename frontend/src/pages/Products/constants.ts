import type { DropDownOption } from "@/components/ui/DropDown";

// Stats shown under the page title, in this order.
export const VISIBLE_STAT_IDS = [
  "total-products",
  "items-in-inventory",
  "inventory-value",
];

export const CATEGORY_OPTIONS: DropDownOption[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "home", label: "Home" },
];

export const AVAILABILITY_OPTIONS: DropDownOption[] = [
  { value: "in-stock", label: "In Stock" },
  { value: "out-of-stock", label: "Out of Stock" },
];
