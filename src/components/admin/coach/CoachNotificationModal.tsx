
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Coach } from "@/types/coach";

interface CoachNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoaches: Coach[];
  onSend: (title: string, message: string) => Promise<void>;
}

export const CoachNotificationModal: React.FC<CoachNotificationModalProps> = ({
  isOpen,
  onClose,
  selectedCoaches,
  onSend,
}) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }

    setSending(true);
    try {
      await onSend(title, message);
      toast.success(`Notification sent to ${selectedCoaches.length} coach${selectedCoaches.length > 1 ? 'es' : ''}`);
      setTitle("");
      setMessage("");
      onClose();
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Notification to Coaches</DialogTitle>
          <DialogDescription>
            Send a notification to {selectedCoaches.length} selected coach{selectedCoaches.length > 1 ? 'es' : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={sending}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={sending}>
              {sending ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
