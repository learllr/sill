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
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Header from "./Header.jsx";

const data = {
  navMain: [
    {
      title: "Gestion de chantiers",
      items: [
        { title: "Chantiers", url: "/chantiers" },
        { title: "Clients", url: "/clients" },
        { title: "Fournisseurs", url: "/fournisseurs" },
        { title: "Sous-traitants", url: "/sous-traitants" },
        { title: "Architectes", url: "/architectes" },
      ],
    },
    {
      title: "Suivi de documents",
      items: [
        { title: "Devis", url: "/devis" },
        { title: "Factures", url: "/factures" },
      ],
    },
    {
      title: "Services RH",
      items: [
        { title: "Salariés", url: "/salariés" },
        { title: "Notes de services", url: "/notes-de-service" },
      ],
    },
    {
      title: "Services administratifs",
      items: [
        { title: "Banque", url: "/banque" },
        { title: "Statut SILL", url: "/statut-sill" },
      ],
    },
    {
      title: "Comptabilité",
      items: [{ title: "Comptabilité ZIED", url: "/compatibilité-zied" }],
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
                          className={`hover:bg-gray-50 text-gray-700 ${
                            location.pathname === subItem.url
                              ? "text-primary bg-gray-100 font-semibold"
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
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarContent>
    </SidebarProvider>
  );
}
