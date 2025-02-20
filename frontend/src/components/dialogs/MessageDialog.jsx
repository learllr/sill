import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

const ICONS = {
  error: <AlertCircle className="text-red-500 w-6 h-6" />,
  warning: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
  info: <Info className="text-blue-500 w-6 h-6" />,
  success: <CheckCircle className="text-green-500 w-6 h-6" />,
};

export default function MessageDialog({
  isOpen,
  onClose,
  type = "info",
  message,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col items-center text-center space-y-4 px-6 py-8">
        <div className="flex items-center space-x-2">
          {ICONS[type] || ICONS.info}
          <DialogTitle>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
        </div>
        <DialogDescription className="text-sm text-gray-800">
          {message}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
