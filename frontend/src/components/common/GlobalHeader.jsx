import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ConfirmDialog from "../dialogs/ConfirmDialog";

export default function GlobalHeader() {
  const { isAuthenticated, logoutUser } = useUser();
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between px-4">
      <div className="flex items-center shrink-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className="flex items-center justify-center rounded-full [&_svg]:!size-6 text-gray-600"
        >
          <Settings />
        </Button>

        {isAuthenticated && (
          <Button
            variant="outline"
            size="icon"
            aria-label="Déconnexion"
            className="flex items-center justify-center rounded-full text-red-500 border-red-500 hover:text-red-600 hover:border-red-600 hover:bg-white"
            onClick={() => setDialogOpen(true)}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleLogout}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Oui, me déconnecter"
        cancelText="Annuler"
      />
    </header>
  );
}
