import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import EditableContent from "../Files/EditableContent.jsx";

export default function EditableContentManager({
  documentTypeId,
  allowMultiple = true,
  showRemoveButton = true,
  isEditing,
  setIsEditing,
}) {
  const [editableContents, setEditableContents] = useState([
    { id: Date.now(), documentTypeId },
  ]);

  const addEditableContent = () => {
    if (!allowMultiple && editableContents.length > 0) {
      return;
    }
    setEditableContents((prev) => [
      ...prev,
      { id: Date.now(), documentTypeId, isNew: true },
    ]);
  };

  const removeEditableContent = (id) => {
    setEditableContents((prev) => prev.filter((content) => content.id !== id));
  };

  return (
    <div className="w-full">
      {editableContents.map((content) => (
        <div key={content.id} className="mb-6 flex items-center relative">
          <EditableContent
            documentTypeId={content.documentTypeId}
            isNew={content.isNew}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          {showRemoveButton && (
            <Button
              onClick={() => removeEditableContent(content.id)}
              variant="destructive"
              aria-label="Supprimer ce contenu"
              className="text-white [&_svg]:!size-3 h-8 w-8 ml-4"
            >
              <FaTimes />
            </Button>
          )}
        </div>
      ))}

      {allowMultiple || editableContents.length === 0 ? (
        <div className="flex justify-end mt-4">
          <Button
            onClick={addEditableContent}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            Ajouter un nouveau document
          </Button>
        </div>
      ) : null}
    </div>
  );
}
