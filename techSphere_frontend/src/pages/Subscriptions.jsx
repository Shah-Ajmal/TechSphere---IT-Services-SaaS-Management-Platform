import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, DollarSign } from "lucide-react";

const Subscriptions = () => {
  const subscriptions = [
    {
      id: 1,
      client: "Tech Corp",
      plan: "Premium",
      service: "Cloud Hosting + Security",
      amount: "$148/mo",
      nextBilling: "2024-02-15",
      status: "Active",
    },
    {
      id: 2,
      client: "Design Studio",
      plan: "Basic",
      service: "IT Monitoring",
      amount: "$79/mo",
      nextBilling: "2024-02-20",
      status: "Active",
    },
    {
      id: 3,
      client: "Marketing Inc",
      plan: "Pro",
      service: "Database Management",
      amount: "$129/mo",
      nextBilling: "2024-02-18",
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage client subscriptions and billing
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,829</div>
            <p className="text-xs text-muted-foreground">
              +180 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Renewals
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Subscriptions</h2>
        {subscriptions.map((subscription) => (
          <Card key={subscription.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{subscription.client}</h3>
                    <Badge>{subscription.plan}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {subscription.service}
                  </p>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <div className="text-lg font-bold">{subscription.amount}</div>
                  <div className="text-sm text-muted-foreground">
                    Next billing: {subscription.nextBilling}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      subscription.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {subscription.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
