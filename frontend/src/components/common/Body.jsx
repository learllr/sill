import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Gestion de chantiers",
      items: [
        { title: "Chantiers", url: "/projects" },
        { title: "Fournisseurs", url: "/suppliers" },
        { title: "Sous-traitants", url: "/subcontractors" },
        { title: "Clients", url: "/clients" },
        { title: "Architectes", url: "/architects" },
      ],
    },
    {
      title: "Suivi de devis et factures",
      items: [
        { title: "Devis", url: "/quotes" },
        { title: "Factures", url: "/invoices" },
      ],
    },
    {
      title: "Services RH",
      items: [
        { title: "Salariés", url: "/employees" },
        { title: "Notes de services", url: "/memos" },
      ],
    },
    {
      title: "Services administratifs",
      items: [
        { title: "Banque", url: "/bank" },
        { title: "Statut SILL", url: "/sill-status" },
      ],
    },
    {
      title: "Comptabilité",
      items: [{ title: "Comptabilité ZIED", url: "/zied-accounting" }],
    },
  ],
};

function AppSidebar({ ...props }) {
  const location = useLocation();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">SILL</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <div className="font-semibold text-sm text-sidebar-foreground px-3 mt-3 mb-2">
                  {item.title}
                </div>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className={`${
                            location.pathname === subItem.url
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : ""
                          }`}
                        >
                          <Link to={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default function Body({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarContent>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex items-center gap-4">
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
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarContent>
    </SidebarProvider>
  );
}
