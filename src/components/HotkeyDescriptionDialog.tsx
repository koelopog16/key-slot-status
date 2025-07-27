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
  keyLabel: string;
  currentDescription?: string;
}

export const HotkeyDescriptionDialog = ({
  isOpen,
  onClose,
  onSave,
  keyLabel,
  currentDescription = "",
}: HotkeyDescriptionDialogProps) => {
  const [description, setDescription] = useState(currentDescription);

  const handleSave = () => {
    onSave(description);
    onClose();
  };

  const handleCancel = () => {
    setDescription(currentDescription);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Hotkey Description</DialogTitle>
          <DialogDescription>
            Add a description for the "{keyLabel}" key to help you remember what it does.
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
              className="col-span-3"
              placeholder="e.g., Jump, Attack, Open inventory..."
              maxLength={20}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};