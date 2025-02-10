import { useState } from "react";
import { employeeMenuItems } from "../../../../../shared/constants/menuItems";
import ContactManager from "../../common/Managers/ContactManager/ContactManager";

export default function Participants({ participantType }) {
  const [selectedSubTab, setSelectedSubTab] = useState("Actifs");

  if (!participantType) {
    return (
      <p className="text-red-500 text-center">Type de participant manquant.</p>
    );
  }

  const participantMap = {
    salarié: {
      menuItems: employeeMenuItems,
    },
  };

  return (
    <ContactManager
      title={`${participantType}s`}
      contactType={participantType}
      menuItems={participantMap[participantType]?.menuItems}
      selectedSubTab={selectedSubTab}
      setSelectedSubTab={setSelectedSubTab}
    />
  );
}
