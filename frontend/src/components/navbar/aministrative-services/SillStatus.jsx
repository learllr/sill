import React from "react";
import Body from "../../common/Body.jsx";
import EditableContent from "../../common/EditableContent.jsx";

export default function Bank() {
  return (
    <Body>
      <div className="px-4 w-full">
        <h1 className="text-2xl font-semibold mb-6">Statut SILL</h1>
        <EditableContent initialContent={null} documentTypeId={17} />
      </div>
    </Body>
  );
}
