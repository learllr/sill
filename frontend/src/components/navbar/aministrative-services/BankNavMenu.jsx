import NavigationTabs from "../../common/Buttons/NavigationTabs.jsx";

const menuItems = ["Relevés de comptes", "Documents bancaires"];

export default function BankNavMenu({ onTabChange }) {
  return <NavigationTabs items={menuItems} onTabChange={onTabChange} />;
}
