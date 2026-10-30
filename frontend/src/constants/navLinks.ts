export interface NavLink {
  label: string;
  key: string;
  icon: string;
}

export const navLinks: NavLink[] = [
  { label: "Dashboard", key: "dashboard", icon: "bi-speedometer2" },
  { label: "Agent Console", key: "agent-console", icon: "bi-headset" },
  { label: "Products", key: "products", icon: "bi-box-seam" },
  { label: "Orders", key: "orders", icon: "bi-cart" },
  { label: "Customers", key: "customers", icon: "bi-people" },
  { label: "Settings", key: "settings", icon: "bi-gear" },
];
