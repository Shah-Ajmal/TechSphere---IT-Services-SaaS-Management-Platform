import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllTickets } from "@/redux/slices/ticketSlice";
import { Plus, Filter as FilterIcon, Search } from "lucide-react";

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
// Change these lines in Tickets.jsx
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

  // Feature 7: Real-time Refresh Logic
  const refreshData = () => dispatch(fetchAllTickets(filters));

  useEffect(() => {
    refreshData();
  }, [filters]);

  const isAdmin = user?.role === "admin";

  return (
    <div className="p-6 space-y-6 container mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tickets</h1>
          <p className="text-muted-foreground">
            Manage support requests and track progress.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus size={18} /> New Ticket
        </Button>
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
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>
            <select
              className="border rounded-md p-2 bg-background text-sm"
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell className="font-medium">
                    <div>{ticket.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.category}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.status === "Open" ? "destructive" : "secondary"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm ${
                        ticket.priority === "High"
                          ? "text-red-500 font-bold"
                          : ""
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                    {ticket.assignedTo?.name || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      Details
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTicketToAssign(ticket)}
                      >
                        Assign
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Feature 1: Create Modal */}
      <CreateTicketModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={refreshData}
      />

      {/* Feature 4: View Details (Drawer) */}
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
