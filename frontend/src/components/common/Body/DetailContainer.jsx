import { useState } from "react";
import { Trash2, Pencil, X } from "lucide-react";
import NewDocumentForm from "./NewDocumentForm";
import EditDocumentForm from "./EditDocumentForm";

export default function DetailContainer({
  onClose,
  isNew,
  documentType,
  document,
  onDelete,
  isDeleting,
  onUpdate,
  isUpdating,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce document ?")) {
      onDelete(document.id);
    }
  };

  return (
    <div className="border p-4 flex flex-col space-y-3">
      <div className="flex justify-end space-x-2">
        {!isNew && !isEditing && (
          <button
            onClick={handleDelete}
            className="p-2 bg-red-500 text-white hover:bg-red-600 transition"
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : <Trash2 className="w-5 h-5" />}
          </button>
        )}

        {!isNew && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={onClose}
          className="p-2 bg-gray-400 text-white hover:bg-gray-500 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {isNew ? (
        <NewDocumentForm onSave={onClose} documentType={documentType} />
      ) : isEditing ? (
        <EditDocumentForm
          document={document}
          onSave={onClose}
          documentType={documentType}
          onUpdate={onUpdate}
          isUpdating={isUpdating}
        />
      ) : (
        <div className="p-2 space-y-3">
          <h2 className="text-lg font-semibold">Détails du document</h2>
          <p>
            <strong>Année :</strong> {document?.year}
          </p>
          <p>
            <strong>Mois :</strong> {document?.month}
          </p>
          <a
            href={`${import.meta.env.VITE_BASE_URL}/uploads/${document?.path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Voir le document
          </a>
        </div>
      )}
    </div>
  );
}
