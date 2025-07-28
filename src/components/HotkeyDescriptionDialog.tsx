import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HotkeyDescriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (description: string) => void;
  onSkip?: () => void;
  keyLabel: string;
  currentDescription?: string;
}

export const HotkeyDescriptionDialog = ({
  isOpen,
  onClose,
  onSave,
  onSkip,
  keyLabel,
  currentDescription = "",
}: HotkeyDescriptionDialogProps) => {
  const [description, setDescription] = useState(currentDescription);

  const handleSave = () => {
    onSave(description);
    onClose();
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    onClose();
  };

  const handleCancel = () => {
    setDescription(currentDescription);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Hotkey Description (Optional)</DialogTitle>
          <DialogDescription>
            Add a description for the "{keyLabel}" key to help you remember what it does, or skip to proceed without one.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              className="col-span-3"
              placeholder="e.g., Jump, Attack, Open inventory..."
              maxLength={15}
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Press Enter to save, or use the buttons below. Max 15 characters.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};