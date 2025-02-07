import { useState } from "react";
import { bankMenuItems } from "../../../../../shared/constants/menuItems.js";
import { DocumentType } from "../../../../../shared/constants/types.js";
import DocumentManager from "../../common/Body/DocumentManager.jsx";

export default function Bank() {
  const [selectedMainTab, setSelectedMainTab] = useState(
    DocumentType.RELEVES_DE_COMPTES
  );

  return (
    <DocumentManager
      title="Banque"
      selectedMainTab={selectedMainTab}
      setSelectedMainTab={setSelectedMainTab}
      menuItems={bankMenuItems}
    />
  );
}
