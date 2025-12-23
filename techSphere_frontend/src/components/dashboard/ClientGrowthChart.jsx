import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ClientGrowthChart = ({ data }) => {
  // Sample data if none provided
  const chartData = data || [
    { month: "Jan", new: 12, active: 108, inactive: 5 },
    { month: "Feb", new: 15, active: 120, inactive: 3 },
    { month: "Mar", new: 18, active: 135, inactive: 3 },
    { month: "Apr", new: 22, active: 152, inactive: 5 },
    { month: "May", new: 28, active: 175, inactive: 5 },
    { month: "Jun", new: 35, active: 205, inactive: 5 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Growth</CardTitle>
        <CardDescription>New clients and retention trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar
              dataKey="new"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              name="New Clients"
            />
            <Bar
              dataKey="active"
              fill="hsl(var(--chart-2))"
              radius={[8, 8, 0, 0]}
              name="Active Clients"
            />
            <Bar
              dataKey="inactive"
              fill="hsl(var(--muted))"
              radius={[8, 8, 0, 0]}
              name="Inactive"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ClientGrowthChart;
