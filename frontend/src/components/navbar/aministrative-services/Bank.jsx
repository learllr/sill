import React from "react";
import Body from "../../common/Body.jsx";
import EditableContentManager from "../../common/Files/EditableContentManager.jsx";

export default function Bank() {
  return (
    <Body>
      <div className="px-4 w-full">
        <h1 className="text-2xl font-semibold mb-6">Banque</h1>
        <EditableContentManager documentTypeId={16} allowMultiple={false} />
      </div>
    </Body>
  );
}
