import { Outlet } from "react-router";
import Sidebar from "../Sidebar";

// The frame shared by every logged-in page: Sidebar on the left,
// and the current page (picked by the router) rendered in <Outlet />.
function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
