import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-2 shrink-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
      </div>

      <div className="flex flex-grow items-center mx-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4 shrink-0">
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
          className="px-4 py-2 text-red-500 border-red-500 hover:text-red-600 hover:border-red-600 hover:bg-white"
          onClick={() => {
            console.log("Déconnexion");
          }}
        >
          Déconnexion
        </Button>
      </div>
    </header>
  );
}
