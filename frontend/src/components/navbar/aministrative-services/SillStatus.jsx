import { useState } from "react";
import { sillStatusMenuItems } from "../../../../../shared/constants/menuItems.js";
import { DocumentType } from "../../../../../shared/constants/types.js";
import DocumentManager from "../../common/Body/DocumentManager.jsx";

export default function SillStatus() {
  const [selectedMainTab, setSelectedMainTab] = useState(DocumentType.BILANS);

  return (
    <DocumentManager
      title="Statut SILL"
      selectedMainTab={selectedMainTab}
      setSelectedMainTab={setSelectedMainTab}
      menuItems={sillStatusMenuItems}
    />
  );
}
