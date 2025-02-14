import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Check, Edit, FileText, Mail, Trash2, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../../../../../shared/utils/formatUtils";
import { useDocuments } from "../../../../hooks/useDocuments";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SendingCard({
  document,
  onDocumentIdClick,
  onDelete,
  participants,
  documents,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(document.name || "");
  const [editedRemarks, setEditedRemarks] = useState(document.remarks || "");
  const { updateSending } = useDocuments();

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

  const getDocumentLinks = () => {
    return documentIds
      .map((docId) => {
        const doc = documents?.find((d) => d.id === docId);
        return doc ? `${BASE_URL}/uploads/${doc.path}` : null;
      })
      .filter(Boolean);
  };

  const downloadFiles = async () => {
    const links = getDocumentLinks();
    if (links.length === 0) {
      return;
    }

    const zip = new JSZip();
    try {
      const downloadPromises = links.map(async (link) => {
        try {
          const response = await fetch(link);
          const blob = await response.blob();
          const filename = link.split("/").pop() || "fichier_inconnu";
          zip.file(filename, blob);
        } catch (error) {
          console.error(`Erreur lors du téléchargement de ${link}:`, error);
        }
      });

      await Promise.all(downloadPromises);

      zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        const zipFilename = `${formatDate(document.date)} - ${
          document.name || "Documents"
        }.zip`;

        if (zipBlob) {
          saveAs(zipBlob, zipFilename);
        }
      });
    } catch (error) {
      console.error("Erreur lors de la génération du fichier ZIP:", error);
    }
  };

  const sendMail = async () => {
    await downloadFiles();
    const mailBody = encodeURIComponent(
      `Bonjour,\nVoici les documents\nMerci.`
    );

    // const mailHref = `https://mail.orange.fr/appsuite/#!!&app=io.ox/mail&folder=default0/INBOX&to=&body=${mailBody}}`;
    const mailUrl = `https://mail.google.com/mail/?view=cm&fs=1&body=${mailBody}`;
    window.open(mailUrl);
  };

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

  const handleSave = () => {
    updateSending.mutate({
      sendingId: document.id,
      formData: { name: editedName, remarks: editedRemarks },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(document.name || "");
    setEditedRemarks(document.remarks || "");
    setIsEditing(false);
  };

  return (
    <div className="relative border border-blue-200 p-3 rounded-lg text-center w-[250px] flex-shrink-0 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer min-h-[120px]">
      <div className="flex justify-between">
        <button
          onClick={sendMail}
          className="bg-gray-100 hover:bg-orange-100 text-orange-600 rounded-full p-2 transition"
        >
          <Mail size={16} />
        </button>

        <div className="flex space-x-2">
          {!isEditing && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onDelete(document.id);
              }}
              className="bg-gray-100 hover:bg-red-100 text-red-600 rounded-full p-2 transition"
            >
              <Trash2 size={16} />
            </button>
          )}
          {isEditing ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="bg-gray-100 hover:bg-green-100 text-green-600 rounded-full p-2 transition"
              >
                <Check size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="bg-gray-100 hover:bg-red-100 text-red-600 rounded-full p-2 transition"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-full p-2 transition"
            >
              <Edit size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 text-left">
        {isEditing ? (
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nom
            </label>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="border p-2 w-full rounded-md"
            />
          </div>
        ) : document.name ? (
          <div className="border text-center text-zinc-900 text-sm font-semibold px-3 rounded-md mb-2 mt-2 p-2">
            {document.name}
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-gray-800 font-semibold">
        {formatDate(document.date)}
      </p>
      <p className="text-gray-600">
        {documentIds.length}{" "}
        {getPluralizedLabel(documentIds.length, "document", "documents")}
      </p>

      <div className="mt-2 text-left">
        {isEditing ? (
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Remarques
            </label>
            <textarea
              value={editedRemarks}
              onChange={(e) => setEditedRemarks(e.target.value)}
              className="border p-2 w-full rounded-md resize-none h-20"
            />
          </div>
        ) : (
          <span className="whitespace-pre-wrap text-zinc-400 text-sm">
            {document.remarks}
          </span>
        )}
      </div>

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
                        {docDetails ? formatDate(docDetails.date) : "Inconnu"}
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
