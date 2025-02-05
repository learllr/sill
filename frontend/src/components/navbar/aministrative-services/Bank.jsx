import React, { useState } from "react";
import EditableContentManager from "../../common/Files/EditableContentManager.jsx";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions.jsx";
import BankNavMenu from "./BankNavMenu.jsx";

export default function Bank() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Relevés bancaires");

  return (
    <div className="px-4 w-full">
      <DetailsHeaderActions
        title="Banque"
        onEdit={() => setIsEditing(!isEditing)}
        onDelete={() => {}}
        showRemoveButton={false}
      />

      <BankNavMenu onTabChange={setSelectedTab} />

      <EditableContentManager
        documentTypeId={16}
        allowMultiple={false}
        showRemoveButton={false}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
    </div>
  );
}
