import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllTickets } from "@/redux/slices/ticketSlice";
import { Plus, Filter as FilterIcon, Search, RefreshCw } from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Sub-components
import CreateTicketModal from "@/components/tickets/CreateTicketModal";
import TicketDetailsDialog from "@/components/tickets/TicketDetailsDialog";
import AssignTicketModal from "@/components/tickets/AssignTicketModal";

const TicketsPage = () => {
  const dispatch = useAppDispatch();
  const { items: tickets, loading } = useAppSelector((state) => state.tickets);
  const { user } = useAppSelector((state) => state.auth);

  // Local UI States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToAssign, setTicketToAssign] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.role === "admin";

  // Feature 7: Real-time Refresh Logic
  const refreshData = async () => {
    setRefreshing(true);
    await dispatch(fetchAllTickets(filters));
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    refreshData();
  }, [filters]);

  // Get badge variant for status
  const getStatusVariant = (status) => {
    switch (status) {
      case "Open":
        return "destructive";
      case "In Progress":
        return "default";
      case "Resolved":
        return "secondary";
      case "Closed":
        return "outline";
      default:
        return "default";
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "text-red-600 font-bold";
      case "High":
        return "text-orange-500 font-semibold";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "";
    }
  };

  // Filter statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  };

  return (
    <div className="p-6 space-y-6 container mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? "Manage all support requests and assign to team members"
              : "View and manage your support tickets"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={refreshData}
            disabled={refreshing}
            title="Refresh tickets"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus size={18} /> New Ticket
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgress}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature 6: Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-2.5 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search by title..."
                className="pl-10"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
            <select
              className="border rounded-md p-2 bg-background text-sm min-w-[150px]"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
            <select
              className="border rounded-md p-2 bg-background text-sm min-w-[150px]"
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tickets found</p>
              <Button
                variant="link"
                onClick={() => setIsCreateOpen(true)}
                className="mt-2"
              >
                Create your first ticket
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket._id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{ticket.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {ticket.category}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-sm ${getPriorityColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {ticket.assignedTo?.name || (
                            <span className="text-muted-foreground italic">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            Details
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTicketToAssign(ticket)}
                            >
                              Assign
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature 1: Create Modal */}
      <CreateTicketModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={refreshData}
      />

      {/* Feature 4: View Details (Dialog) */}
      {selectedTicket && (
        <TicketDetailsDialog
          ticket={selectedTicket}
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
          onUpdate={refreshData}
        />
      )}

      {/* Feature 5: Assign Modal */}
      {ticketToAssign && (
        <AssignTicketModal
          ticket={ticketToAssign}
          open={!!ticketToAssign}
          onOpenChange={() => setTicketToAssign(null)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default TicketsPage;
