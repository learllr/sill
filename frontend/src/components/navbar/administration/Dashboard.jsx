import { useState } from "react";
import { dashboardMenuItems } from "../../../../../shared/constants/menuItems.js";
import NavigationTabs from "../../common/Design/Buttons/NavigationTabs";
import Section from "../../common/Managers/Section.jsx";
import { useUser } from "../../contexts/UserContext.jsx";
import LoginHistory from "./TabComponents/LoginHistory.jsx";
import SignatureStamp from "./TabComponents/SignatureStamp.jsx";
import TeamOverview from "./TabComponents/TeamOverview.jsx";
import TrashBin from "./TabComponents/TrashBin.jsx";
import UserPermissions from "./TabComponents/UserPermissions.jsx";

export default function Dashboard() {
  const { roleId } = useUser();

  const availableTabs = dashboardMenuItems
    .filter((item) => item.label !== "Gestion des droits" || roleId === 1)
    .map((item) => item.label);

  const [selectedTab, setSelectedTab] = useState(availableTabs[0]);

  const tabComponents = {
    ...(roleId === 1 && { "Gestion des droits": <UserPermissions /> }),
    Équipe: <TeamOverview />,
    "Historique des connexions": <LoginHistory />,
    Corbeille: <TrashBin />,
    "Tampon de signature": <SignatureStamp />,
  };

  return (
    <div>
      <Section title="Tableau de bord" />
      <NavigationTabs
        menuItems={availableTabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="mt-4">{tabComponents[selectedTab] || null}</div>
    </div>
  );
}
