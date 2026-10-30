import { Routes, Route, Navigate } from "react-router";
import { PATHS } from "./paths";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/Dashboard";
import AgentConsolePage from "../pages/AgentConsole";
import ProductsPage from "../pages/Products";
import OrdersPage from "../pages/Orders";
import CustomersPage from "../pages/Customers";
import SettingsPage from "../pages/Settings";

function AppRouter() {
  return (
    <Routes>
      <Route path={PATHS.login} element={<LoginPage />} />

      {/* Pages inside this route share the MainLayout (Sidebar + Outlet). */}
      <Route element={<MainLayout />}>
        <Route path={PATHS.dashboard} element={<DashboardPage />} />
        <Route path={PATHS.agentConsole} element={<AgentConsolePage />} />
        <Route path={PATHS.products} element={<ProductsPage />} />
        <Route path={PATHS.orders} element={<OrdersPage />} />
        <Route path={PATHS.customers} element={<CustomersPage />} />
        <Route path={PATHS.settings} element={<SettingsPage />} />
      </Route>

      {/* "/" and any unknown URL go to the login page. */}
      <Route path="*" element={<Navigate to={PATHS.login} replace />} />
    </Routes>
  );
}

export default AppRouter;
