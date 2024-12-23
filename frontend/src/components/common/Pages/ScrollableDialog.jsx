import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function ScrollableDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  submitLabel = "Confirmer",
  cancelLabel = "Annuler",
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <ScrollArea className="max-h-[80vh]">
          <DialogHeader className="p-4">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <Separator />
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 px-4">
            {children}
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => onClose(false)}
              >
                {cancelLabel}
              </Button>
              <Button type="submit">{submitLabel}</Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
