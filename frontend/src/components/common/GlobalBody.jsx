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
import { useUser } from "../contexts/UserContext";
import GlobalHeader from "./GlobalHeader.jsx";

const fullMenu = [
  {
    title: "Gestion de chantiers",
    items: [{ title: "Chantiers", url: "/chantiers" }],
  },
  {
    title: "Gestion des intervenants",
    items: [
      { title: "Clients", url: "/clients" },
      { title: "Fournisseurs", url: "/fournisseurs" },
      { title: "Sous-traitants", url: "/sous-traitants" },
      { title: "Architectes", url: "/architectes" },
    ],
  },
  {
    title: "Services RH",
    items: [
      { title: "Salariés", url: "/salariés" },
      { title: "Notes", url: "/notes" },
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
    items: [
      { title: "Comptabilité ZIED", url: "/compatibilité-zied" },
      { title: "Signature de document", url: "/document-signing" },
    ],
  },
  {
    title: "Administration",
    items: [{ title: "Tableau de bord", url: "/dashboard" }],
  },
];

function AppSidebar({ ...props }) {
  const location = useLocation();
  const { roleId } = useUser();

  const hasFullAccess = roleId <= 2;

  const filteredMenu = hasFullAccess
    ? fullMenu
    : fullMenu.filter(
        (section) =>
          !(
            roleId >= 3 &&
            ["Administration", "Comptabilité"].includes(section.title)
          )
      );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <GalleryVerticalEnd />
                <span className="font-semibold">SILL</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredMenu.map((item) => (
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

export default function GlobalBody({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarContent>
        <GlobalHeader />
        <div className="flex flex-1 flex-col gap-4 px-4 text-sm">
          {children}
        </div>
      </SidebarContent>
    </SidebarProvider>
  );
}
