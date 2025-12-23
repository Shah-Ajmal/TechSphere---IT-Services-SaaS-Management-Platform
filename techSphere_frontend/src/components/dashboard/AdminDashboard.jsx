import { useState, useEffect } from "react";
import { Users, DollarSign, TrendingUp, Ticket } from "lucide-react";
import MetricCard from "./MetricCard";
import RevenueChart from "./RevenueChart";
import ClientGrowthChart from "./ClientGrowthChart";
import RecentActivity from "./RecentActivity";
import RecentTickets from "./RecentTickets";
import TopServices from "./TopServices";
import { getAllClients } from "@/services/clientService";
import { getAllServices } from "@/services/serviceService";
import { getAllTickets } from "@/services/ticketService";

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    activeSubscriptions: 0,
    revenue: 0,
    openTickets: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [clientsRes, servicesRes, ticketsRes] = await Promise.all([
        getAllClients({ limit: 1000 }),
        getAllServices({ limit: 1000 }),
        getAllTickets({ limit: 1000 }),
      ]);

      // Calculate metrics
      const totalClients = clientsRes.data.totalClients || 0;
      const activeSubscriptions = clientsRes.data.clients.filter(
        (client) => client.subscriptionStatus === "Active"
      ).length;

      // Calculate revenue (sum of all active service prices)
      const revenue = servicesRes.data.services
        .filter((service) => service.activeStatus)
        .reduce((sum, service) => sum + service.price, 0);

      const openTickets = ticketsRes.data.tickets.filter(
        (ticket) => ticket.status === "Open"
      ).length;

      setMetrics({
        totalClients,
        activeSubscriptions,
        revenue,
        openTickets,
      });

      // Set recent tickets and top services
      setRecentTickets(ticketsRes.data.tickets.slice(0, 5));
      setTopServices(servicesRes.data.services.slice(0, 5));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const metricsData = [
    {
      title: "Total Clients",
      value: loading ? "..." : metrics.totalClients.toString(),
      change: "+12.5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Subscriptions",
      value: loading ? "..." : metrics.activeSubscriptions.toString(),
      change: "+8.2%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Monthly Revenue",
      value: loading ? "..." : `$${metrics.revenue.toLocaleString()}`,
      change: "+15.3%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Open Support Tickets",
      value: loading ? "..." : metrics.openTickets.toString(),
      change: metrics.openTickets > 0 ? "+4.1%" : "-4.1%",
      icon: Ticket,
      trend: metrics.openTickets > 0 ? "up" : "down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">
            ADMIN
          </span>
        </div>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your complete business overview.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <ClientGrowthChart />
      </div>

      {/* Widgets Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentActivity />
        <RecentTickets tickets={recentTickets} />
        <TopServices services={topServices} />
      </div>
    </div>
  );
};

export default AdminDashboard;
