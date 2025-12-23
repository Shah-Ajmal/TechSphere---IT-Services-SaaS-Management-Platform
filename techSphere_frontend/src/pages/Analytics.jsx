import ChartPlaceholder from "@/components/dashboard/ChartPlaceholder";
import MetricCard from "@/components/dashboard/MetricCard";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const Analytics = () => {
  const metrics = [
    {
      title: "Total Revenue",
      value: "$124,543",
      change: "+18.2%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "New Clients",
      value: "342",
      change: "+12.5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: "68.4%",
      change: "+5.1%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Churn Rate",
      value: "2.3%",
      change: "-1.2%",
      icon: Activity,
      trend: "down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights and metrics about your business performance
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Revenue Trends" />
        <ChartPlaceholder title="Client Acquisition" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartPlaceholder title="Service Performance" />
        <ChartPlaceholder title="Subscription Distribution" />
      </div>

      <div>
        <ChartPlaceholder title="Year-over-Year Growth" />
      </div>
    </div>
  );
};

export default Analytics;
