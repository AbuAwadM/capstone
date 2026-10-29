export interface NavLink {
  label: string;
  key: string;
}

export const navLinks: NavLink[] = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Products", key: "products" },
  { label: "Orders", key: "orders" },
  { label: "Customers", key: "customers" },
  { label: "Settings", key: "settings" },
];
