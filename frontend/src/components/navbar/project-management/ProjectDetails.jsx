import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTypeName } from "../../../../../shared/constants/types.js";
import ProjectManager from "../../common/Managers/ProjectManager/ProjectManager.jsx";
import MarketInfo from "../../common/Managers/ProjectManager/MarketInfo.jsx";
import ProjectInfo from "../../common/Managers/ProjectManager/ProjectInfo.jsx";
import { precisionProjectItems } from "../../../../../shared/constants/menuItems.js";

export default function ProjectDetails() {
  const { id } = useParams();
  const menuItems = precisionProjectItems;

  const [selectedMainTab, setSelectedMainTab] = useState("");
  const [selectedSubTab, setSelectedSubTab] = useState("");

  useEffect(() => {
    if (menuItems.length > 0) {
      setSelectedMainTab(menuItems[0].label);
      setSelectedSubTab(menuItems[0].subMenu?.[0] || "");
    }
  }, [menuItems]);

  return (
    <div className="space-y-6">
      <ProjectManager
        title={`Détails du chantier`}
        selectedMainTab={selectedMainTab}
        setSelectedMainTab={setSelectedMainTab}
        selectedSubTab={selectedSubTab}
        setSelectedSubTab={setSelectedSubTab}
        menuItems={menuItems}
        projectId={id}
        ProjectInfoComponent={() => <ProjectInfo projectId={id} />}
        MarketInfoComponent={() => <MarketInfo projectId={id} />}
      />
    </div>
  );
}
