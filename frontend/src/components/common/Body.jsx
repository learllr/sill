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

const data = {
  navMain: [
    {
      title: "Gestion de chantiers",
      url: "#",
      items: [
        { title: "Chantiers", url: "#" },
        { title: "Fournisseurs", url: "#", isActive: true },
        { title: "Sous-traitants", url: "#" },
        { title: "Clients", url: "#" },
        { title: "Architectes", url: "#" },
      ],
    },
    {
      title: "Suivi de devis et factures",
      url: "#",
      items: [
        { title: "Devis", url: "#" },
        { title: "Factures", url: "#" },
      ],
    },
    {
      title: "Services RH",
      url: "#",
      items: [
        { title: "Salariés", url: "#" },
        { title: "Notes de services", url: "#" },
      ],
    },
    {
      title: "Services administratifs",
      url: "#",
      items: [
        { title: "Banque", url: "#" },
        { title: "Statut SILL", url: "#" },
      ],
    },
    {
      title: "Comptabilité",
      url: "#",
      items: [{ title: "Comptabilité ZIED", url: "#" }],
    },
  ],
};

function AppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">SILL</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                        >
                          <a href={subItem.url}>{subItem.title}</a>
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

export default function Body() {
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarContent>
    </SidebarProvider>
  );
}
