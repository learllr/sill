import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function NavigationTabs({ menuItems, onTabChange }) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-4 border-b pb-2 mb-6">
        {menuItems.map((item) => (
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
