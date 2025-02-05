import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const menuItems = {
  Fournisseur: ["Devis", "Factures", "Fiches techniques", "Bons pour accord"],
  Client: ["Devis", "Factures", "Devis validés"],
  "Sous-traitant": ["Administratif", "Contrats", "Factures"],
  Architecte: [
    "Plans",
    "Bons de commandes",
    "PV",
    "Ordres de règlement",
    "Réserves",
    "Marchés",
    "DOE",
  ],
};

export default function ParticipantNavMenu({ participantType, onTabChange }) {
  const items = menuItems[participantType] || [];

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-4 border-b pb-2">
        {items.map((item) => (
          <NavigationMenuItem key={item}>
            <NavigationMenuLink
              onClick={() => onTabChange(item)}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-black cursor-pointer"
            >
              {item}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
