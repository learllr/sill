import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPrecisionContactMenuItems,
  getTypeName,
} from "../../../../../shared/constants/types.js";
import ContactInfo from "../../common/Managers/ContactManager/ContactInfo.jsx";
import DocumentManager from "../../common/Managers/DocumentManager/DocumentManager.jsx";

export default function ParticipantDetails({ participantType }) {
  const { id } = useParams();

  const menuItems =
    getPrecisionContactMenuItems[getTypeName(participantType, "english")] || [];

  const [selectedMainTab, setSelectedMainTab] = useState(
    menuItems[0]?.label || ""
  );
  const [selectedSubTab, setSelectedSubTab] = useState(
    menuItems[0]?.subMenu?.[0] || ""
  );

  return (
    <div className="space-y-6">
      <DocumentManager
        title={`Détails du ${getTypeName(participantType, "singular")}`}
        selectedMainTab={selectedMainTab}
        setSelectedMainTab={setSelectedMainTab}
        selectedSubTab={selectedSubTab}
        setSelectedSubTab={setSelectedSubTab}
        menuItems={menuItems}
        participantId={id}
        documentScope="sub"
        ContactInfoComponent={() => (
          <ContactInfo contactId={id} contactType={participantType} />
        )}
      />
    </div>
  );
}
