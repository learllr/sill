// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   getProjectMenuItems,
//   getTypeName,
// } from "../../../../../shared/constants/types.js";
// import Marché from "../../common/Managers/ProjectManager/Marché.jsx";
// import ProjectManager from "../../common/Managers/ProjectManager/ProjectManager.jsx";

export default function ProjectDetails({ projectType }) {
  // const { id } = useParams();
  // const menuItems = getProjectMenuItems(projectType) || [];
  // const [selectedMainTab, setSelectedMainTab] = useState("");
  // const [selectedSubTab, setSelectedSubTab] = useState("");
  // useEffect(() => {
  //   if (menuItems.length > 0) {
  //     setSelectedMainTab(menuItems[0].label);
  //     setSelectedSubTab(menuItems[0].subMenu?.[0] || "");
  //   }
  // }, [menuItems]);
  // return (
  //   <div className="space-y-6">
  //     <ProjectManager
  //       title={`Détails du ${getTypeName(projectType, "singular")}`}
  //       selectedMainTab={selectedMainTab}
  //       setSelectedMainTab={setSelectedMainTab}
  //       selectedSubTab={selectedSubTab}
  //       setSelectedSubTab={setSelectedSubTab}
  //       menuItems={menuItems}
  //       projectId={id}
  //       MarchéComponent={() => (
  //         <Marché projectId={id} projectType={projectType} />
  //       )}
  //     />
  //   </div>
  // );
  return null;
}
