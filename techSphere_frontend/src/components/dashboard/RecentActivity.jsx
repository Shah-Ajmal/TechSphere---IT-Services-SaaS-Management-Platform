import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Ticket, DollarSign, CheckCircle } from "lucide-react";

const activityIcons = {
  client: UserPlus,
  ticket: Ticket,
  subscription: DollarSign,
  resolved: CheckCircle,
};

const activityColors = {
  client: "text-blue-500",
  ticket: "text-orange-500",
  subscription: "text-green-500",
  resolved: "text-purple-500",
};

const RecentActivity = ({ activities }) => {
  // Sample data if none provided
  const defaultActivities = [
    {
      id: 1,
      type: "client",
      title: "New client registered",
      description: "Tech Corp signed up for Premium plan",
      time: "5 minutes ago",
      user: "TC",
    },
    {
      id: 2,
      type: "ticket",
      title: "New support ticket",
      description: "Server downtime issue reported",
      time: "12 minutes ago",
      user: "JS",
    },
    {
      id: 3,
      type: "subscription",
      title: "Subscription renewed",
      description: "Design Studio renewed Pro plan",
      time: "1 hour ago",
      user: "DS",
    },
    {
      id: 4,
      type: "resolved",
      title: "Ticket resolved",
      description: "Database connection issue fixed",
      time: "2 hours ago",
      user: "MI",
    },
    {
      id: 5,
      type: "client",
      title: "Client updated",
      description: "Marketing Inc upgraded to Enterprise",
      time: "3 hours ago",
      user: "MI",
    },
  ];

  const activityList = activities || defaultActivities;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates from your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityList.map((activity) => {
            const Icon = activityIcons[activity.type];
            const iconColor = activityColors[activity.type];

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={iconColor}>
                    <Icon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
