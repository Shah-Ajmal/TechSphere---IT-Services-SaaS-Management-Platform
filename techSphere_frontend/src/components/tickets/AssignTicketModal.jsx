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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, User } from "lucide-react";
import { updateTicket } from "@/services/ticketService";
import axiosInstance from "@/lib/axios";

const AssignTicketModal = ({ ticket, open, onOpenChange, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (open) {
      fetchUsers();
      setSelectedUser(ticket?.assignedTo?._id || "");
    }
  }, [open, ticket]);

  const fetchUsers = async () => {
    setFetchingUsers(true);
    try {
      // Try to fetch users from backend
      const response = await axiosInstance.get("/users");
      if (response.data.success) {
        setUsers(response.data.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // If /users endpoint doesn't exist, fetch from auth or use empty array
      setUsers([]);
      setMessage({
        type: "error",
        text: "Unable to fetch users. Please contact admin to set up user management.",
      });
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedUser) {
      setMessage({ type: "error", text: "Please select a user" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await updateTicket(ticket._id, {
        assignedTo: selectedUser,
      });

      if (response.success) {
        setMessage({ type: "success", text: "Ticket assigned successfully!" });
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to assign ticket",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Ticket</DialogTitle>
          <DialogDescription>
            Assign this ticket to a team member
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {message.text && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Ticket Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">{ticket?.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {ticket?.category} • {ticket?.priority} Priority
            </p>
          </div>

          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user-select">Assign To</Label>
            {fetchingUsers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                No users available. Please ensure the /api/users endpoint is set
                up.
              </div>
            ) : (
              <select
                id="user-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Current Assignment */}
          {ticket?.assignedTo && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>
                Currently assigned to: <strong>{ticket.assignedTo.name}</strong>
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            disabled={loading || !selectedUser || users.length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTicketModal;
