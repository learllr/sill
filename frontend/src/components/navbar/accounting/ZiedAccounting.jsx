import { useState } from "react";
import { projectMenuItems } from "../../../../../shared/constants/menuItems";
import ProjectManager from "../../common/Managers/ProjectManager/ProjectManager";

export default function Projects() {
  const [selectedSubTab, setSelectedSubTab] = useState("En cours");

  return (
    <ProjectManager
      title="Comptabilité ZIED des chantiers"
      menuItems={projectMenuItems}
      selectedSubTab={selectedSubTab}
      setSelectedSubTab={setSelectedSubTab}
      isZied={true}
    />
  );
}
