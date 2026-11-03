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
    <div>
      <div>
        <img src={iconSrc} alt="" width={40} height={40} />
        <p>{title}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>

      <div>
        {insights.map((insight) => (
          <div key={insight.id}>
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
