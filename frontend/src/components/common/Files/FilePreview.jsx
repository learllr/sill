import { useEffect, useState } from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { X } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function FilePreview({ file, fileName, title, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(`${BASE_URL}/uploads/${fileName}`);
    }
  }, [file, fileName]);

  if (!fileName && !file) return null;

  const fileType =
    fileName?.split(".").pop().toLowerCase() ||
    file?.name.split(".").pop().toLowerCase();
  let previewContent = null;

  if (["jpg", "jpeg", "png"].includes(fileType)) {
    previewContent = (
      <img
        src={previewUrl}
        alt="Aperçu"
        className="w-full h-full object-cover rounded-lg"
      />
    );
  } else if (fileType === "pdf") {
    previewContent = <FaFilePdf size={100} className="text-red-600" />;
  } else if (["doc", "docx"].includes(fileType)) {
    previewContent = <FaFileWord size={100} className="text-blue-600" />;
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {previewContent}

      {title && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
          {title}
        </div>
      )}

      {onRemove && (
        <button
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          onClick={onRemove}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
