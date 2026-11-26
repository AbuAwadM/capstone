import type { DropDownOption } from "@/components/ui/DropDown";
import type { FilterValues } from "@/components/layout/TabularPageLayout/TabularPageLayout";

// An empty string means "no filter" — it's the value of each control's placeholder.
export const EMPTY_FILTERS: FilterValues = {
  query: "",
  status: "",
  payment: "",
};

export const STATUS_OPTIONS: DropDownOption[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const PAYMENT_OPTIONS: DropDownOption[] = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "refunded", label: "Refunded" },
];
