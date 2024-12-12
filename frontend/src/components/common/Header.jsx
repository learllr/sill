import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import SearchBar from "./SearchBar";
import { Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2 shrink-0">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
      </div>

      <div className="flex flex-grow items-center mx-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button
          className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100"
          aria-label="Settings"
        >
          <Settings className="h-6 w-6 text-gray-600" />
        </button>
        <button
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={() => {
            console.log("Déconnexion");
          }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}
