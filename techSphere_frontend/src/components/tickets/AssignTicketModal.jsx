import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateTicket } from "@/services/ticketService";
import { User, UserCheck } from "lucide-react";
import axiosInstance from "@/lib/axios";

const AssignTicketModal = ({ open, onOpenChange, ticket, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(
    ticket?.assignedTo?._id || ""
  );
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchUsers();
      setSelectedUserId(ticket?.assignedTo?._id || "");
    }
  }, [open, ticket]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      // Try to fetch all users - adjust endpoint based on your backend
      const response = await axiosInstance.get("/users");
      if (response.data.success) {
        // Filter for admin users only
        const adminUsers = response.data.data.users.filter(
          (u) => u.role === "admin"
        );
        setUsers(adminUsers);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      // Fallback: Use mock admin users if endpoint doesn't exist
      setUsers([
        {
          _id: "mock1",
          name: "Admin User",
          email: "admin@techsphere.com",
          role: "admin",
        },
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Automatically update status when assigning
      const updateData = selectedUserId
        ? {
            assignedTo: selectedUserId,
            status: "In Progress", // Auto-update status
          }
        : {
            assignedTo: null,
            status: "Open", // Revert to Open if unassigned
          };

      const response = await updateTicket(ticket._id, updateData);

      if (response.success) {
        onOpenChange(false);
        onSuccess(); // Triggers Redux fetchAllTickets in the parent
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign ticket");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Ticket</DialogTitle>
          <DialogDescription>
            Assign this ticket to a team member for resolution
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Current Assignment */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Currently Assigned:</span>
              {ticket?.assignedTo ? (
                <Badge variant="outline">{ticket.assignedTo.name}</Badge>
              ) : (
                <Badge variant="secondary">Unassigned</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Ticket: {ticket?.title}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Assign To</Label>

            {loadingUsers ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading team members...
              </div>
            ) : users.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No team members available
              </div>
            ) : (
              <div className="grid gap-2 max-h-[300px] overflow-y-auto">
                {/* Unassign Option */}
                <button
                  type="button"
                  onClick={() => setSelectedUserId("")}
                  disabled={loading}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                    ${
                      !selectedUserId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }
                    ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Unassigned</div>
                    <p className="text-sm text-muted-foreground">
                      Remove current assignment
                    </p>
                  </div>
                  {!selectedUserId && (
                    <UserCheck className="h-5 w-5 text-primary shrink-0" />
                  )}
                </button>

                {/* User Options */}
                {users.map((user) => {
                  const isSelected = selectedUserId === user._id;

                  return (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => setSelectedUserId(user._id)}
                      disabled={loading}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                        ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }
                        ${
                          loading
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      `}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {isSelected && (
                        <UserCheck className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading || selectedUserId === (ticket?.assignedTo?._id || "")
              }
            >
              {loading ? "Assigning..." : "Assign Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTicketModal;
