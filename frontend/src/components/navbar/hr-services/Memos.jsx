import { useState } from "react";
import { memoMenuItems } from "../../../../../shared/constants/menuItems.js";
import { DocumentType } from "../../../../../shared/constants/types.js";
import DocumentManager from "../../common/Body/DocumentManager.jsx";

export default function Memos() {
  const [selectedMainTab, setSelectedMainTab] = useState(
    DocumentType.NOTES_DE_SERVICE
  );

  return (
    <DocumentManager
      title="Mémos"
      selectedMainTab={selectedMainTab}
      setSelectedMainTab={setSelectedMainTab}
      menuItems={memoMenuItems}
    />
  );
}
