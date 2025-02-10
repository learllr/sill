import { useState } from "react";
import ProjectManager from "../../common/Managers/ProjectManager/ProjectManager";
import { projectMenuItems } from "../../../../../shared/constants/menuItems";

export default function Projects() {
  const [selectedSubTab, setSelectedSubTab] = useState("En cours");

  return (
    <ProjectManager
      title="Chantiers"
      menuItems={projectMenuItems}
      selectedSubTab={selectedSubTab}
      setSelectedSubTab={setSelectedSubTab}
    />
  );
}
