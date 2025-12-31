import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  getTicketById,
  addTicketNote,
  updateTicket,
} from "@/services/ticketService";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TicketDetailsDialog = ({ ticket, open, onOpenChange, onUpdate }) => {
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (open && ticket) {
      fetchTicketDetails();
    }
  }, [open, ticket]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const response = await getTicketById(ticket._id);
      if (response.success) {
        setTicketData(response.data.ticket);
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setNoteLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await addTicketNote(ticket._id, { message: noteText });
      if (response.success) {
        setTicketData(response.data.ticket);
        setNoteText("");
        setMessage({ type: "success", text: "Note added successfully!" });
        onUpdate();

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add note",
      });
    } finally {
      setNoteLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!isAdmin) return;

    setStatusLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await updateTicket(ticket._id, { status: newStatus });
      if (response.success) {
        setTicketData(response.data.ticket);
        setMessage({ type: "success", text: "Status updated successfully!" });
        onUpdate();

        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update status",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status) => {
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

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!ticketData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ticket Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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

          {/* Ticket Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{ticketData.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{ticketData.userId?.name || "Unknown User"}</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(ticketData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Badge variant={getStatusColor(ticketData.status)}>
                  {ticketData.status}
                </Badge>
                <div
                  className={`px-2 py-1 rounded text-xs text-white text-center ${getPriorityColor(
                    ticketData.priority
                  )}`}
                >
                  {ticketData.priority}
                </div>
              </div>
            </div>

            {/* Ticket Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium">{ticketData.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Assigned To</Label>
                <p className="font-medium">
                  {ticketData.assignedTo?.name || "Unassigned"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <p className="mt-2 text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-lg">
                {ticketData.description}
              </p>
            </div>
          </div>

          {/* Status Update (ADMIN ONLY) */}
          {isAdmin && (
            <>
              <Separator />
              <div>
                <Label className="mb-2 block">Update Status (Admin Only)</Label>
                <div className="flex flex-wrap gap-2">
                  {["Open", "In Progress", "Resolved", "Closed"].map(
                    (status) => (
                      <Button
                        key={status}
                        variant={
                          ticketData.status === status ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleStatusChange(status)}
                        disabled={statusLoading}
                      >
                        {statusLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {status}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Notes Section (ALL USERS CAN ADD) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5" />
              <Label className="text-lg">Notes & Comments</Label>
              <span className="text-sm text-muted-foreground">
                ({ticketData.notes?.length || 0})
              </span>
            </div>

            {/* Notes List */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {ticketData.notes && ticketData.notes.length > 0 ? (
                ticketData.notes.map((note, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {note.addedBy?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {note.addedBy?.name || "Unknown"}
                        </span>
                        {note.addedBy?.role === "admin" && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.addedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{note.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notes yet. Be the first to add a note!
                </p>
              )}
            </div>

            {/* Add Note Form (ALL USERS) */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <Textarea
                placeholder="Add a note or comment..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={noteLoading}
                rows={3}
              />
              <Button type="submit" disabled={noteLoading || !noteText.trim()}>
                {noteLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Note
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsDialog;
