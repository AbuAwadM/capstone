import dummyDashboardStats from "../../data/dummyDashboardStats.json";
import type { Stat } from "../../types/dashboard";

const ADMINNAME = "Mohammad";

function DashboardHeading() {
  function formatToday(date: Date = new Date()) {
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    return `${weekday}, ${date.getDate()} ${month}`;
  }
  return (
    <div className="flex flex-col gap-1 mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Welcome, {ADMINNAME}
      </h1>
      <h6 className="text-sm font-medium text-gray-500">{formatToday()}</h6>
    </div>
  );
}

// Placeholder data — replace with the response from the FastAPI endpoint.
const STATS: Stat[] = dummyDashboardStats;

function DataBox({ id, title, value }: Stat) {
  return (
    <div id={id} className="flex flex-col gap-1 p-4 bg-white">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="h-full overflow-y-auto p-8">
      <DashboardHeading />
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      <div className="grid grid-cols-1 gap-px mt-4 overflow-hidden bg-gray-100 rounded-lg shadow sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STATS.map((stat) => (
          <DataBox key={stat.id} {...stat} />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
