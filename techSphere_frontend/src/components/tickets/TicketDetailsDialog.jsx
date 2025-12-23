import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react"; // Icon for delete
import {
  addTicketNote,
  updateTicket,
  deleteTicket,
} from "@/services/ticketService";
import { useAppSelector } from "@/redux/hooks";

const TicketDetailsDialog = ({ ticket, open, onOpenChange, onUpdate }) => {
  const [newNote, setNewNote] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const handleNoteSubmit = async () => {
    if (!newNote.trim()) return;
    const res = await addTicketNote(ticket._id, { message: newNote });
    if (res.success) {
      setNewNote("");
      onUpdate();
    }
  };

  const handleStatusChange = async (status) => {
    await updateTicket(ticket._id, { status });
    onUpdate();
  };

  // Feature: Delete Ticket (Admin Only)
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        const res = await deleteTicket(ticket._id);
        if (res.success) {
          onOpenChange(false); // Close the sheet
          onUpdate(); // Refresh the list
        }
      } catch (err) {
        alert("Failed to delete ticket");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <SheetTitle>{ticket.title}</SheetTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{ticket.status}</Badge>
              <Badge variant="secondary">{ticket.priority}</Badge>
            </div>
          </div>

          {/* Admin Delete Button */}
          {isAdmin && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete Ticket"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Description</h4>
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
              {ticket.description}
            </p>
          </div>

          {/* Admin Status Controls */}
          {isAdmin && (
            <div className="space-y-2 border-t pt-4">
              <h4 className="text-sm font-semibold">Update Status</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange("In Progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                  onClick={() => handleStatusChange("Resolved")}
                >
                  Resolve
                </Button>
              </div>
            </div>
          )}

          {/* Conversation Thread */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-sm font-semibold">Activity Notes</h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {ticket.notes?.length > 0 ? (
                ticket.notes.map((note, i) => (
                  <div
                    key={i}
                    className="text-xs p-2 rounded-lg bg-secondary/50"
                  >
                    <div className="flex justify-between font-bold mb-1">
                      <span>{note.addedBy?.name || "System"}</span>
                      <span className="text-muted-foreground">
                        {new Date(note.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {note.message}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No notes yet.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={newNote}
                className="text-sm"
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button className="w-full" size="sm" onClick={handleNoteSubmit}>
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TicketDetailsDialog;
