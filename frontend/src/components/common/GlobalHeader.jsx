import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Settings } from "lucide-react";
import GlobalSearchBar from "./GlobalSearchBar";

export default function GlobalHeader() {
  return (
    <header className="flex h-16 items-center justify-between px-4">
      <div className="flex items-center shrink-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
      </div>

      <div className="flex flex-grow items-center mx-4">
        <GlobalSearchBar />
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

        <Button
          variant="outline"
          size="icon"
          aria-label="Déconnexion"
          className="flex items-center justify-center rounded-full text-red-500 border-red-500 hover:text-red-600 hover:border-red-600 hover:bg-white"
          onClick={() => {
            console.log("Déconnexion");
          }}
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
