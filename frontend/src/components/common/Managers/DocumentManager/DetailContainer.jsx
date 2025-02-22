import { Pencil, Trash2, Undo2, X } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../../../dialogs/ConfirmDialog.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import DocumentDetails from "./DocumentDetails.jsx";
import EditDocumentForm from "./EditDocumentForm.jsx";
import NewDocumentForm from "./NewDocumentForm.jsx";
import NewSendingForm from "./NewSendingForm.jsx";

export default function DetailContainer({
  onClose,
  isNew,
  documentType,
  document,
  addMutation,
  deleteMutation,
  updateMutation,
  addSending,
  employeeId,
  participantId,
  projectId,
  isCEDIG,
  selectedDocuments,
  isSending,
  inParticipantSection,
  isAddingSending,
  isDOE,
  isTrash,
  showMessage,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (isTrash) {
      deleteMutation.mutate(document.id, {
        onSuccess: () => {
          showMessage(
            "success",
            "Le document a été supprimé définitivement avec succès."
          );
          setIsConfirmOpen(false);
          onClose();
        },
        onError: () => {
          showMessage(
            "error",
            "Une erreur est survenue lors de la suppression du document."
          );
        },
      });
    } else {
      updateMutation.mutate(
        { documentId: document.id, formData: { deleted: true } },
        {
          onSuccess: () => {
            showMessage(
              "success",
              "Le document a été déplacé dans la corbeille."
            );
            setIsConfirmOpen(false);
            onClose();
          },
          onError: () => {
            showMessage(
              "error",
              "Impossible de déplacer le document dans la corbeille."
            );
          },
        }
      );
    }
  };

  const handleRestore = () => {
    if (document.participant?.deleted || document.project?.deleted) {
      showMessage(
        "error",
        "Impossible de restaurer ce document. Veuillez d'abord restaurer le projet et/ou l'intervenant associé."
      );
      return;
    }

    updateMutation.mutate(
      { documentId: document.id, formData: { deleted: false } },
      {
        onSuccess: () => {
          showMessage("success", "Le document a été restauré avec succès.");
          onClose();
        },
        onError: () => {
          showMessage(
            "error",
            "Une erreur est survenue lors de la restauration du document."
          );
        },
      }
    );
  };

  return (
    <div
      className={`p-4 flex flex-col space-y-3 h-[80vh] overflow-auto ${
        isTrash ? "border border-rose-300" : "border"
      }`}
    >
      <div className="flex justify-end space-x-2">
        {isTrash && (
          <IconButton
            onClick={handleRestore}
            variant="green"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Restauration..." : <Undo2 />}
          </IconButton>
        )}
        {!isNew &&
          !isEditing &&
          !isSending &&
          !inParticipantSection &&
          !isDOE && (
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
          !isSending &&
          !inParticipantSection &&
          !isDOE &&
          !isTrash && (
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
          isAddingSending ? (
            <NewSendingForm
              onSave={onClose}
              addMutation={addSending}
              selectedDocuments={selectedDocuments}
              isCEDIG={isCEDIG}
              isDOE={isDOE}
              projectId={projectId}
              showMessage={showMessage}
            />
          ) : (
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
              showMessage={showMessage}
            />
          )
        ) : isEditing ? (
          <EditDocumentForm
            document={document}
            onSave={onClose}
            documentType={documentType}
            onUpdate={(documentId, formData) => {
              updateMutation.mutate(
                { documentId, formData },
                {
                  onSuccess: () => {
                    showMessage(
                      "success",
                      "Le document a été mis à jour avec succès."
                    );
                    onClose();
                  },
                  onError: () => {
                    showMessage(
                      "error",
                      "Une erreur est survenue lors de la mise à jour du document."
                    );
                  },
                }
              );
            }}
            isUpdating={updateMutation.isLoading}
            employeeId={employeeId}
            isCEDIG={isCEDIG}
          />
        ) : (
          <DocumentDetails
            document={document}
            employeeId={employeeId}
            isTrash={isTrash}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message={`Voulez-vous vraiment supprimer ${
          isTrash ? "définitivement" : ""
        } ce document ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
