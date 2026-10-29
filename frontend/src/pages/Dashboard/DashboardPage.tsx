import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";

function DashboardPage() {
  const [activeKey, setActiveKey] = useState("dashboard");

  return (
    <div className="d-flex bg-light">
      <Sidebar activeKey={activeKey} onSelect={setActiveKey} />
      <main className="flex-grow-1 p-5">
        <h1 className="fw-bold">Dashboard</h1>
      </main>
    </div>
  );
}

export default DashboardPage;
