import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const menuItems = {
  Fournisseur: ["Devis", "Factures", "Bons pour accord"],
  Client: [
    "Devis",
    "Factures",
    "Fiches techniques",
    "Bons de commandes",
    "Bons de livraison",
    "AR de commandes",
  ],
  "Sous-traitant": ["Administratif", "Contrats", "Factures"],
  Architecte: [
    "Plans",
    "Bons de commandes",
    "PV",
    "Ordres de règlement",
    "Réserves",
    "Marchés",
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
