import { Trash2, Pencil, X } from "lucide-react";
import NewDocumentForm from "./NewDocumentForm";

export default function DetailContainer({ onClose, isNew, documentType }) {
  return (
    <div className="border p-4 flex flex-col space-y-3">
      <div className="flex justify-end space-x-2">
        {!isNew && (
          <button className="p-2 bg-red-500 text-white hover:bg-red-600 transition">
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        {!isNew ? (
          <button className="p-2 bg-blue-500 text-white hover:bg-blue-600 transition">
            <Pencil className="w-5 h-5" />
          </button>
        ) : null}

        <button
          onClick={onClose}
          className="p-2 bg-gray-400 text-white hover:bg-gray-500 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {isNew ? (
        <NewDocumentForm onSave={onClose} documentType={documentType} />
      ) : (
        <div className="p-2">Édition du document</div>
      )}
    </div>
  );
}
