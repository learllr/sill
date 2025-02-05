import NavigationTabs from "../../common/Buttons/NavigationTabs.jsx";

const menuItems = ["Bilans", "Statuts"];

export default function SillStatusNavMenu({ selectedTab, onTabChange }) {
  return <NavigationTabs items={menuItems} onTabChange={onTabChange} />;
}
