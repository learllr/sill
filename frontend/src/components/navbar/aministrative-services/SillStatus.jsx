import React from "react";
import Body from "../../common/Body.jsx";
import EditableContentManager from "../../common/Files/EditableContentManager.jsx";

export default function StatutSILL() {
  return (
    <Body>
      <div className="px-4 w-full">
        <h1 className="text-2xl font-semibold mb-6">Statut SILL</h1>
        <EditableContentManager documentTypeId={17} allowMultiple={false} />
      </div>
    </Body>
  );
}
