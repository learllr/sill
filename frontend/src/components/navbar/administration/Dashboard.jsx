import { useState } from "react";
import { dashboardMenuItems } from "../../../../../shared/constants/menuItems.js";
import NavigationTabs from "../../common/Design/Buttons/NavigationTabs";
import Section from "../../common/Managers/Section.jsx";
import ActivityLogs from "./TabComponents/ActivityLogs.jsx";
import SignatureStamp from "./TabComponents/SignatureStamp.jsx";
import TrashBin from "./TabComponents/TrashBin.jsx";
import UserPermissions from "./TabComponents/UserPermissions.jsx";

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(dashboardMenuItems[0].label);

  const tabComponents = {
    "Gestion des droits": <UserPermissions />,
    "Historique des actions": <ActivityLogs />,
    Corbeille: <TrashBin />,
    "Tampon de signature": <SignatureStamp />,
  };

  return (
    <div>
      <Section title="Tableau de bord" />
      <NavigationTabs
        menuItems={dashboardMenuItems.map((item) => item.label)}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="mt-4">{tabComponents[selectedTab] || null}</div>
    </div>
  );
}
