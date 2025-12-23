import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const RecentTickets = ({ tickets }) => {
  const navigate = useNavigate();

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

  if (!tickets || tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets</CardTitle>
          <CardDescription>Latest support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No tickets yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Latest support requests</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/tickets")}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tickets.slice(0, 5).map((ticket) => (
            <div
              key={ticket._id}
              className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              onClick={() => navigate("/dashboard/tickets")}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm line-clamp-1">
                  {ticket.title}
                </h4>
                <Badge
                  variant={getStatusColor(ticket.status)}
                  className="text-xs ml-2"
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
                  {ticket.userId?.name || "Unknown User"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTickets;
