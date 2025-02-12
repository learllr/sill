import { useState } from "react";
import { ziedMenuItems } from "../../../../../shared/constants/menuItems.js";
import DocumentManager from "../../common/Managers/DocumentManager/DocumentManager.jsx";

export default function ZiedAccounting() {
  const [selectedMainTab, setSelectedMainTab] = useState(
    ziedMenuItems[0].label
  );
  const [selectedSubTab, setSelectedSubTab] = useState(
    ziedMenuItems[0].subMenu?.[0] || ""
  );

  return (
    <DocumentManager
      title="Détails de la comptabilité ZIED du chantier"
      selectedMainTab={selectedMainTab}
      setSelectedMainTab={setSelectedMainTab}
      selectedSubTab={selectedSubTab}
      setSelectedSubTab={setSelectedSubTab}
      menuItems={ziedMenuItems}
    />
  );
}
