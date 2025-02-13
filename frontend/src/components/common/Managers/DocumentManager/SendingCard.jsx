import { ChevronDown, ChevronUp, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SendingCard({
  document,
  onDocumentIdClick,
  onDelete,
  participants,
  documents,
}) {
  const [isOpen, setIsOpen] = useState(false);

  let documentIds = document.documentIds;
  try {
    if (typeof documentIds === "string") {
      documentIds = JSON.parse(documentIds);
      if (typeof documentIds === "string") {
        documentIds = JSON.parse(documentIds);
      }
    }
  } catch (error) {
    documentIds = [];
  }

  const categorizedDocuments = {
    Clients: [],
    Fournisseurs: [],
    Autres: [],
  };

  documentIds.forEach((docId) => {
    const doc = documents?.find((d) => d.id === docId);
    const participant = participants?.find((p) => p.id === doc?.participantId);

    if (participant?.type === "Client") {
      categorizedDocuments.Clients.push(docId);
    } else if (participant?.type === "Fournisseur") {
      categorizedDocuments.Fournisseurs.push(docId);
    } else {
      categorizedDocuments.Autres.push(docId);
    }
  });

  return (
    <div
      className="border border-blue-300 p-3 rounded-lg text-center w-[250px] flex-shrink-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(document.id);
          }}
          className="bg-gray-100 hover:bg-red-100 text-red-600 rounded-full p-2 transition"
        >
          <Trash2 size={16} />
        </button>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      <p className="mt-2 text-gray-800 font-semibold">
        {document.year} - {document.month}
      </p>
      <p className="text-gray-600">{documentIds.length} documents</p>

      {isOpen && (
        <div className="mt-2 border-t pt-2 text-left">
          {Object.entries(categorizedDocuments).map(
            ([category, docs]) =>
              docs.length > 0 && (
                <div key={category} className="mb-2">
                  <p className="font-semibold text-gray-700">{category}</p>
                  {docs.map((docId, index) => (
                    <p
                      key={index}
                      className="text-gray-500 flex items-center gap-2"
                    >
                      <FileText size={14} />
                      <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDocumentIdClick(docId);
                        }}
                      >
                        {docId}
                      </span>
                    </p>
                  ))}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
