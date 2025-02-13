import { FileText, Trash2 } from "lucide-react";

export default function SendingCard({
  document,
  onDocumentIdClick,
  onDelete,
  participants,
  documents,
}) {
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

  const getPluralizedLabel = (count, singular, plural) =>
    count === 1 ? singular : plural;

  return (
    <div className="relative border border-blue-200 p-3 rounded-lg text-center w-[250px] flex-shrink-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer min-h-[120px]">
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
      </div>
      <p className="mt-2 text-gray-800 font-semibold">
        {document.year} - {document.month}
      </p>
      <p className="text-gray-600">
        {documentIds.length}{" "}
        {getPluralizedLabel(documentIds.length, "document", "documents")}
      </p>

      <div className="mt-2 border-t pt-2 text-left">
        {Object.entries(categorizedDocuments).map(
          ([category, docs]) =>
            docs.length > 0 && (
              <div key={category} className="mb-2">
                <p className="font-semibold text-gray-700">
                  {getPluralizedLabel(
                    docs.length,
                    category.slice(0, -1),
                    category
                  )}
                </p>
                {docs.map((docId, index) => {
                  const docDetails = documents?.find((d) => d.id === docId);
                  return (
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
                        {docDetails
                          ? `${docDetails.month} - ${docDetails.year}`
                          : "Inconnu"}
                      </span>
                    </p>
                  );
                })}
              </div>
            )
        )}
      </div>
    </div>
  );
}
