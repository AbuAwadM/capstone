import dummyInsightsData from "../../data/dummyInsightsData.json";

type InsightFormat = "currency" | "percent" | "number";

interface Insight {
  id: string;
  title: string;
  value: number;
  format: InsightFormat;
  icon: string;
}

interface DashboardCardProps {
  title: string;
  value: string;
  iconSrc: string;
}

// Bootstrap only provides row-cols classes for 1 to 6.
const CARDS_PER_ROW = 4;

const insights = dummyInsightsData as Insight[];

const formatters: Record<InsightFormat, Intl.NumberFormat> = {
  currency: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }),
  percent: new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }),
  number: new Intl.NumberFormat("en-US"),
};

function getIconUrl(fileName: string) {
  return new URL(`../../assets/${fileName}`, import.meta.url).href;
}

function DashboardCard({ title, value, iconSrc }: DashboardCardProps) {
  return (
    <div className="card shadow-sm h-100 ratio ratio-1x1">
      <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
        <img src={iconSrc} alt="" width={40} height={40} className="mb-3" />
        <p className="text-muted mb-2">{title}</p>
        <p className="fs-3 fw-bold mb-0">{value}</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <>
      <h1 className="fw-bold mb-4">Dashboard</h1>

      <div
        className={`row g-4 row-cols-1 row-cols-md-2 row-cols-xl-${CARDS_PER_ROW}`}
      >
        {insights.map((insight) => (
          <div key={insight.id} className="col">
            <DashboardCard
              title={insight.title}
              value={formatters[insight.format].format(insight.value)}
              iconSrc={getIconUrl(insight.icon)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default DashboardPage;
