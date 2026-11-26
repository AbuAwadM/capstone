import { useState } from "react";
import TabularPageLayout, {
  type FilterValues,
} from "@/components/layout/TabularPageLayout/TabularPageLayout";
import { EMPTY_FILTERS, PAYMENT_OPTIONS, STATUS_OPTIONS } from "./constants";

function OrdersPage() {
  const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS);

  // TODO: replace with counts from the FastAPI orders endpoint.
  const stats = [
    { label: "Total Orders", value: 0 },
    { label: "Pending", value: 0 },
    { label: "Delivered", value: 0 },
  ];

  return (
    <TabularPageLayout
      topic="Orders"
      stats={stats}
      filters={[
        { key: "status", placeholder: "Filter by status", options: STATUS_OPTIONS },
        { key: "payment", placeholder: "Filter by payment", options: PAYMENT_OPTIONS },
      ]}
      filterValues={filters}
      onFiltersChange={setFilters}
    >
      {/* TODO: orders table, filtered by `filters`. */}
    </TabularPageLayout>
  );
}

export default OrdersPage;
