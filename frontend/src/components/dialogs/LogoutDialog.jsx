import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function LogoutDialog({ isVisible, onClose, onConfirm }) {
  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Êtes-vous sûr ?
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <DialogDescription className="text-gray-600 mb-4">
          Vous devrez vous reconnecter pour accéder à votre compte.
        </DialogDescription>

        <DialogFooter className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-4 py-2"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="rounded-xl px-4 py-2"
          >
            Se déconnecter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
