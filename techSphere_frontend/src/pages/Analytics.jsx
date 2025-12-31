import { useState, useEffect } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getDashboardAnalytics,
  getRevenueTrends,
  getClientAcquisition,
  getSubscriptionDistribution,
  getServicePerformance,
} from "@/services/analyticsService";
import { Button } from "@/components/ui/button";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Analytics = () => {
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [clientAcquisition, setClientAcquisition] = useState([]);
  const [subscriptionDist, setSubscriptionDist] = useState([]);
  const [servicePerf, setServicePerf] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, [period]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [dashboard, revenue, clients, subscriptions, services] =
        await Promise.all([
          getDashboardAnalytics(period),
          getRevenueTrends(period),
          getClientAcquisition(),
          getSubscriptionDistribution(),
          getServicePerformance(),
        ]);

      // Dashboard metrics
      if (dashboard.success) {
        const data = dashboard.data.metrics;
        setMetrics([
          {
            title: "Total Revenue",
            value: `$${data.revenue.value.toLocaleString()}`,
            change: `${data.revenue.change}%`,
            icon: DollarSign,
            trend: data.revenue.trend,
          },
          {
            title: "New Clients",
            value: data.clients.value.toString(),
            change: `${data.clients.change}%`,
            icon: Users,
            trend: data.clients.trend,
          },
          {
            title: "Conversion Rate",
            value: `${data.conversionRate.value}%`,
            change: data.conversionRate.change,
            icon: TrendingUp,
            trend: data.conversionRate.trend,
          },
          {
            title: "Churn Rate",
            value: `${data.churnRate.value}%`,
            change: data.churnRate.change,
            icon: Activity,
            trend: data.churnRate.trend,
          },
        ]);
      }

      // Chart data
      if (revenue.success) setRevenueTrends(revenue.data);
      if (clients.success) setClientAcquisition(clients.data);
      if (subscriptions.success) setSubscriptionDist(subscriptions.data);
      if (services.success) setServicePerf(services.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const periodButtons = [
    { value: "today", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights and metrics about your business performance
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          {periodButtons.map((btn) => (
            <Button
              key={btn.value}
              variant={period === btn.value ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(btn.value)}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      )}

      {/* Revenue Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueTrends}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Client Acquisition & Subscription Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Client Acquisition */}
        <Card>
          <CardHeader>
            <CardTitle>Client Acquisition</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientAcquisition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clients" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subscriptionDist.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={servicePerf}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="services"
                fill="#8884d8"
                name="Services"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#82ca9d"
                name="Revenue ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
