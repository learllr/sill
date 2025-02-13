import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import DocumentDetails from "./DocumentDetails.jsx";
import EditDocumentForm from "./EditDocumentForm.jsx";
import NewDocumentForm from "./NewDocumentForm.jsx";

export default function DetailContainer({
  onClose,
  isNew,
  documentType,
  document,
  addMutation,
  deleteMutation,
  updateMutation,
  employeeId,
  participantId,
  projectId,
  isCEDIG,
  selectedDocuments,
  isSending,
  inParticipantSection,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce document ?")) {
      deleteMutation.mutate(document.id);
      onClose();
    }
  };

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh] overflow-auto">
      <div className="flex justify-end space-x-2">
        {!isNew &&
          !isEditing &&
          !isCEDIG &&
          !isSending &&
          !inParticipantSection && (
            <IconButton
              onClick={handleDelete}
              variant="red"
              disabled={deleteMutation.isLoading}
            >
              {deleteMutation.isLoading ? "Suppression..." : <Trash2 />}
            </IconButton>
          )}

        {!isNew &&
          !isEditing &&
          !isCEDIG &&
          !isSending &&
          !inParticipantSection && (
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
            employeeId={employeeId}
            participantId={participantId}
            projectId={projectId}
            isCEDIG={isCEDIG}
            selectedDocuments={selectedDocuments}
            isSending={isSending}
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
            employeeId={employeeId}
          />
        ) : (
          <DocumentDetails document={document} employeeId={employeeId} />
        )}
      </div>
    </div>
  );
}
