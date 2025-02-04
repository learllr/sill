import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import FilePreview from "./FilePreview";

export default function FileUploader({
  onFileUpload,
  file = null,
  onRemoveFile,
  onCancel,
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
    console.log(selectedFile);
    onFileUpload?.({ file: selectedFile.file, title: fileTitle });
    handleClearPreview();
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-center space-x-6">
      {/* Colonne 1 : Aperçu du fichier */}
      <div className="w-full flex justify-center">
        <label
          htmlFor="file-upload"
          className="cursor-pointer w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative"
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
              <p className="text-sm">Ajouter un document</p>
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
      </div>

      {/* Colonne 2 : Titre et boutons */}
      <div className="w-full flex flex-col items-center justify-center space-y-5">
        <div className="w-full space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Titre du document
          </label>
          <input
            type="text"
            value={fileTitle}
            onChange={(e) => setFileTitle(e.target.value)}
            className="border rounded p-2 w-full text-sm"
          />
        </div>

        <div className="flex space-x-2 w-full justify-center">
          <Button onClick={handleUpload} className="w-1/2">
            Enregistrer
          </Button>
          <Button variant="secondary" onClick={onCancel} className="w-1/2">
            Annuler
          </Button>
        </div>
      </div>

      {/* Colonne 3 : Trash */}
      {file && onRemoveFile && (
        <div className="flex items-center justify-center">
          <button
            onClick={onRemoveFile}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrashAlt size={20} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center mt-2 w-full">{error}</p>
      )}
    </div>
  );
}
