import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import FilePreview from "./FilePreview";

export default function FileUploader({
  onFileUpload,
  file = null,
  onRemoveFile,
  onCancel, // Nouveau prop pour annuler et revenir à FileDisplay
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTitle, setFileTitle] = useState(file?.title || "");
  const [error, setError] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(!!file);

  useEffect(() => {
    if (file) {
      setSelectedFile({ file: null, fileName: file.fileName });
      setIsPreviewVisible(true);
    }
  }, [file]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille du document ne doit pas dépasser 5 Mo.");
        return;
      }
      setSelectedFile({ file, fileName: file.name });
      setError("");
      setIsPreviewVisible(true);
    }
  };

  const handleClearPreview = () => {
    setSelectedFile(null);
    setIsPreviewVisible(false);
    setError("");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError("Veuillez ajouter un document.");
      return;
    }
    if (!fileTitle || fileTitle.length < 3) {
      setError("Le titre doit contenir au moins 3 caractères.");
      return;
    }
    onFileUpload?.({ file: selectedFile.file, title: fileTitle });
    handleClearPreview();
  };

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      <label
        htmlFor="file-upload"
        className="cursor-pointer w-full h-52 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative"
      >
        {isPreviewVisible ? (
          <FilePreview
            file={selectedFile?.file}
            fileName={selectedFile?.fileName || file?.fileName}
            title={fileTitle}
            onRemove={handleClearPreview}
          />
        ) : (
          <div className="text-gray-500 text-center">
            <p className="text-4xl font-bold">+</p>
            <p className="text-sm">Cliquez pour ajouter un document</p>
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <div className="flex items-center space-x-4 w-full mt-4">
        <input
          type="text"
          value={fileTitle}
          onChange={(e) => setFileTitle(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <Button onClick={handleUpload}>Enregistrer</Button>
        {file && onRemoveFile && (
          <button
            onClick={onRemoveFile}
            className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
          >
            <FaTrashAlt />
          </button>
        )}
      </div>

      <div className="flex justify-between w-full mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Annuler
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
}
