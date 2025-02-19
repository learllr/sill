import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { precisionProjectItems } from "../../../../../shared/constants/menuItems.js";
import ProjectInfo from "../../common/Managers/ProjectManager/ProjectInfo.jsx";
import ProjectManager from "../../common/Managers/ProjectManager/ProjectManager.jsx";

export default function ProjectDetails() {
  const { id } = useParams();
  const location = useLocation();
  const menuItems = precisionProjectItems;

  const [selectedMainTab, setSelectedMainTab] = useState("");
  const [selectedSubTab, setSelectedSubTab] = useState("");

  const isTrash = location.pathname.includes("/corbeille");

  useEffect(() => {
    if (menuItems.length > 0) {
      setSelectedMainTab(menuItems[0].label);
      setSelectedSubTab(menuItems[0].subMenu?.[0] || "");
    }
  }, [menuItems]);

  return (
    <div className="space-y-6">
      <ProjectManager
        title="Détails du chantier"
        selectedMainTab={selectedMainTab}
        setSelectedMainTab={setSelectedMainTab}
        selectedSubTab={selectedSubTab}
        setSelectedSubTab={setSelectedSubTab}
        menuItems={menuItems}
        projectId={id}
        ProjectInfoComponent={() => (
          <ProjectInfo projectId={id} isTrash={isTrash} />
        )}
        isTrash={isTrash}
      />
    </div>
  );
}
