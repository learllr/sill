import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPrecisionContactMenuItems,
  getTypeName,
} from "../../../../../shared/constants/types.js";
import DocumentManager from "../../common/Managers/DocumentManager/DocumentManager.jsx";

export default function ParticipantProjectDetails({ participantType }) {
  const { projectId, participantId } = useParams();

  const menuItems = getPrecisionContactMenuItems(participantType) || [];

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
      <DocumentManager
        title={`Détails du ${getTypeName(
          participantType,
          "singular"
        )} du projet`}
        selectedMainTab={selectedMainTab}
        setSelectedMainTab={setSelectedMainTab}
        selectedSubTab={selectedSubTab}
        setSelectedSubTab={setSelectedSubTab}
        menuItems={menuItems}
        participantId={participantId}
        projectId={projectId}
      />
    </div>
  );
}
