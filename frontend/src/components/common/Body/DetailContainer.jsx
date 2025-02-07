import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import IconButton from "./Design/IconButton";
import DocumentDetails from "./DocumentDetails.jsx";
import EditDocumentForm from "./EditDocumentForm";
import NewDocumentForm from "./NewDocumentForm";

export default function DetailContainer({
  onClose,
  isNew,
  documentType,
  document,
  addMutation,
  deleteMutation,
  updateMutation,
  isParticipant,
  isProject,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce document ?")) {
      deleteMutation.mutate(document.id);
      onClose();
    }
  };

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[64vh] overflow-auto">
      <div className="flex justify-end space-x-2">
        {!isNew && !isEditing && (
          <IconButton
            onClick={handleDelete}
            variant="red"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Suppression..." : <Trash2 />}
          </IconButton>
        )}

        {!isNew && !isEditing && (
          <IconButton onClick={() => setIsEditing(true)} variant="blue">
            <Pencil />
          </IconButton>
        )}

        <IconButton onClick={onClose} variant="gray">
          <X />
        </IconButton>
      </div>

      <div className="w-72 mx-auto">
        {isNew ? (
          <NewDocumentForm
            onSave={onClose}
            documentType={documentType}
            addMutation={addMutation}
            isParticipant={isParticipant}
            isProject={isProject}
          />
        ) : isEditing ? (
          <EditDocumentForm
            document={document}
            onSave={onClose}
            documentType={documentType}
            onUpdate={(documentId, formData) => {
              updateMutation.mutate({ documentId, formData });
              onClose();
            }}
            isUpdating={updateMutation.isLoading}
          />
        ) : (
          <DocumentDetails document={document} />
        )}
      </div>
    </div>
  );
}
