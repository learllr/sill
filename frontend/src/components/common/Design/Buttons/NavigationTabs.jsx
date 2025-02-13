import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function NavigationTabs({
  menuItems,
  selectedTab,
  onTabChange,
}) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-4 border-b pb-2 mb-4">
        {menuItems.map((item) => (
          <NavigationMenuItem key={item}>
            <NavigationMenuLink
              onClick={() => onTabChange(item)}
              className={`px-3 py-1 text-sm font-medium cursor-pointer uppercase
                ${
                  selectedTab === item
                    ? "text-black font-bold"
                    : "text-gray-600 hover:text-black"
                }`}
            >
              {item}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
