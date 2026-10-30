import { Outlet } from "react-router";
import Sidebar from "../Sidebar";

// The frame shared by every logged-in page: Sidebar on the left,
// and the current page (picked by the router) rendered in <Outlet />.
function MainLayout() {
  return (
    <div className="d-flex bg-light">
      <Sidebar />
      <main className="flex-grow-1 p-5">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
