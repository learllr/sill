import React, { useState } from "react";
import Body from "../../common/Body.jsx";
import EditableContentManager from "../../common/Files/EditableContentManager.jsx";
import DetailsHeaderActions from "../../common/Pages/DetailsHeaderActions.jsx";

export default function Bank() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Body>
      <div className="px-4 w-full">
        <DetailsHeaderActions
          title="Banque"
          navigateBack={() => window.history.back()}
          onEdit={() => setIsEditing(!isEditing)}
          onDelete={() => {}}
          backUrl="/"
          showRemoveButton={false}
        />
        <EditableContentManager
          documentTypeId={16}
          allowMultiple={false}
          showRemoveButton={false}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>
    </Body>
  );
}
