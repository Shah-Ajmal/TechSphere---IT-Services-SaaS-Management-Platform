import { useState, useEffect } from "react";
import { Ticket, CheckCircle, Clock, AlertCircle } from "lucide-react";
import MetricCard from "./MetricCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllTickets } from "@/services/ticketService";
import { getAllServices } from "@/services/serviceService";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";

const ClientDashboard = () => {
  const [myTickets, setMyTickets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);

      // Fetch user's tickets and available services
      const [ticketsRes, servicesRes] = await Promise.all([
        getAllTickets({ limit: 100 }),
        getAllServices({ limit: 100, active: true }),
      ]);

      setMyTickets(ticketsRes.data.tickets);
      setServices(servicesRes.data.services.slice(0, 3)); // Show top 3 services
    } catch (err) {
      console.error("Error fetching client data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate user's ticket metrics
  const ticketMetrics = {
    total: myTickets.length,
    open: myTickets.filter((t) => t.status === "Open").length,
    inProgress: myTickets.filter((t) => t.status === "In Progress").length,
    resolved: myTickets.filter(
      (t) => t.status === "Resolved" || t.status === "Closed"
    ).length,
  };

  const metricsData = [
    {
      title: "Total Tickets",
      value: loading ? "..." : ticketMetrics.total.toString(),
      icon: Ticket,
      trend: "up",
    },
    {
      title: "Open Tickets",
      value: loading ? "..." : ticketMetrics.open.toString(),
      icon: AlertCircle,
      trend: "up",
    },
    {
      title: "In Progress",
      value: loading ? "..." : ticketMetrics.inProgress.toString(),
      icon: Clock,
      trend: "up",
    },
    {
      title: "Resolved",
      value: loading ? "..." : ticketMetrics.resolved.toString(),
      icon: CheckCircle,
      trend: "down",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
      case "Critical":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "destructive";
      case "In Progress":
        return "default";
      case "Resolved":
      case "Closed":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <span className="px-2 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded">
            {user?.role?.toUpperCase() || "USER"}
          </span>
        </div>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}! Here's your account overview.
        </p>
      </div>

      {/* Ticket Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tickets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Recent Tickets</CardTitle>
                <CardDescription>Your latest support requests</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/tickets")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : myTickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No tickets yet</p>
                <Button
                  className="mt-4"
                  size="sm"
                  onClick={() => navigate("/dashboard/tickets")}
                >
                  Create Your First Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myTickets.slice(0, 3).map((ticket) => (
                  <div
                    key={ticket._id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate("/dashboard/tickets")}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{ticket.title}</h4>
                      <Badge
                        variant={getStatusColor(ticket.status)}
                        className="text-xs"
                      >
                        {ticket.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getPriorityColor(ticket.priority)}
                        className="text-xs"
                      >
                        {ticket.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {ticket.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Services */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Available Services</CardTitle>
                <CardDescription>Explore our IT services</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard/services")}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-muted animate-pulse rounded"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate("/dashboard/services")}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{service.name}</h4>
                      <span className="text-sm font-bold text-primary">
                        ${service.price}/mo
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-muted-foreground">
                Our support team is here to help you 24/7. Create a ticket and
                we'll get back to you shortly.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate("/dashboard/tickets")}>
              Create Support Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
