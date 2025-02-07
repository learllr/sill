import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function DocumentPreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setFileType(null);
      return;
    }

    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFileType(file.name.split(".").pop().toLowerCase());

      return () => URL.revokeObjectURL(objectUrl);
    } else if (file.path) {
      setPreviewUrl(`${BASE_URL}/uploads/${file.path}`);
      setFileType(file.path.split(".").pop().toLowerCase());
    }
  }, [file]);

  if (!previewUrl) {
    return <p className="text-gray-500 text-center">Aucun aperçu disponible</p>;
  }

  const isPDF = fileType === "pdf";
  const isDOCX = fileType === "docx" || fileType === "doc";

  return (
    <div className="border p-2 rounded-md text-center">
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {isPDF ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <FileText size={48} className="text-red-500" />
            <p className="text-red-500">Fichier PDF</p>
          </div>
        ) : isDOCX ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <FileText size={48} className="text-blue-500" />
            <p className="text-blue-500">Fichier Word</p>
          </div>
        ) : (
          <img
            src={previewUrl}
            alt="Aperçu"
            className="max-w-full h-40 object-cover mx-auto"
          />
        )}
      </a>
    </div>
  );
}
