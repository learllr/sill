import { useState } from "react";
import { employeeMenuItems } from "../../../../../shared/constants/menuItems";
import ContactManager from "../../common/Managers/ContactManager/ContactManager";

export default function Employees() {
  const [selectedSubTab, setSelectedSubTab] = useState("Actifs");

  return (
    <ContactManager
      title="Salariés"
      contactType="employee"
      menuItems={employeeMenuItems}
      selectedSubTab={selectedSubTab}
      setSelectedSubTab={setSelectedSubTab}
    />
  );
}
