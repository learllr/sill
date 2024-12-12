import { useAlert } from "../contexts/AlertContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

const isMobile = () => window.innerWidth <= 768;

export default function AlertComponent() {
  const { alertMessage, alertType, clearAlert } = useAlert();

  let Icon, title, colorVariable;
  switch (alertType) {
    case "destructive":
      Icon = AlertTriangle;
      title = "Erreur";
      colorVariable = "hsl(var(--alert-destructive))";
      break;
    case "success":
      Icon = CheckCircle;
      title = "Succès";
      colorVariable = "hsl(var(--alert-success))";
      break;
    case "warning":
      Icon = AlertCircle;
      title = "Attention";
      colorVariable = "hsl(var(--alert-warning))";
      break;
    case "info":
    default:
      Icon = Info;
      title = "Information";
      colorVariable = "hsl(var(--alert-info))";
      break;
  }

  if (!alertMessage) return null;

  if (isMobile()) {
    return (
      <AlertDialog open={true} onOpenChange={clearAlert}>
        <AlertDialogContent
          className="bg-white border-l-8"
          style={{ borderColor: colorVariable }}
        >
          <div className="flex items-center">
            <Icon className="h-4 w-4 mr-2" style={{ color: colorVariable }} />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearAlert}
              className={`bg-white border-[1px] border-zinc-700 text-zinc-700 hover:bg-slate-50 hover:border-zinc-900 hover:text-zinc-900 rounded-xl transition-colors px-4 py-2`}
            >
              OK
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="fixed top-28 left-1/2 transform -translate-x-1/2 w-11/12 max-w-6xl z-50">
      <Alert
        variant={alertType}
        className="border-l-8 relative bg-white shadow-md"
        style={{ borderColor: colorVariable, color: colorVariable }}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color: colorVariable }} />
          <AlertTitle>{title}</AlertTitle>
        </div>
        <div className="ml-6 text-zinc-700">
          <AlertDescription>{alertMessage}</AlertDescription>
        </div>
        <button
          onClick={clearAlert}
          className="absolute top-2 right-2 text-zinc-700 hover:text-zinc-900"
        >
          <X className="h-4 w-4" />
        </button>
      </Alert>
    </div>
  );
}
