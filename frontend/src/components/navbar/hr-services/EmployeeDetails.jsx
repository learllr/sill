import { useState } from "react";
import { useParams } from "react-router-dom";
import { precisionEmployeeMenuItems } from "../../../../../shared/constants/menuItems.js";
import ContactInfo from "../../common/Managers/ContactManager/ContactInfo.jsx";
import DocumentManager from "../../common/Managers/DocumentManager/DocumentManager.jsx";

export default function EmployeeDetails() {
  const { id } = useParams();

  const menuItems = precisionEmployeeMenuItems;

  const [selectedMainTab, setSelectedMainTab] = useState(
    menuItems[0]?.label || ""
  );
  const [selectedSubTab, setSelectedSubTab] = useState(
    menuItems[0]?.subMenu?.[0] || ""
  );

  return (
    <div className="space-y-6">
      <DocumentManager
        title="Détails du salarié"
        selectedMainTab={selectedMainTab}
        setSelectedMainTab={setSelectedMainTab}
        selectedSubTab={selectedSubTab}
        setSelectedSubTab={setSelectedSubTab}
        menuItems={menuItems}
        employeeId={id}
        documentScope="sub"
        ContactInfoComponent={() => (
          <ContactInfo contactId={id} contactType="employee" />
        )}
      />
    </div>
  );
}
