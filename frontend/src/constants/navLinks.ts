import {
  Box,
  LayoutGrid,
  MessagesSquare,
  Settings2,
  ShoppingBag,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  label: string;
  key: string;
  icon: LucideIcon;
}

export const navLinks: NavLink[] = [
  { label: "Dashboard", key: "dashboard", icon: LayoutGrid },
  { label: "Agent Console", key: "agent-console", icon: MessagesSquare },
  { label: "Products", key: "products", icon: Box },
  { label: "Orders", key: "orders", icon: ShoppingBag },
  { label: "Customers", key: "customers", icon: UsersRound },
  { label: "Settings", key: "settings", icon: Settings2 },
];
