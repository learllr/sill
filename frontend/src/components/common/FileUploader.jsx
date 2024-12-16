import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa";

export default function FileUploader({ onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [fileTitle, setFileTitle] = useState("Titre du document");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La taille du fichier ne doit pas dépasser 5 Mo.");
        return;
      }

      let fileTypeDisplay = "";
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewContent(
          <img
            src={url}
            alt="Aperçu"
            className="w-full h-full object-cover rounded-lg"
          />
        );
        fileTypeDisplay = "Image";
      } else if (file.type === "application/pdf") {
        setPreviewContent(
          <div className="flex justify-center items-center w-full h-full">
            <FaFilePdf size={100} className="text-red-600" />
          </div>
        );
        fileTypeDisplay = "PDF";
      } else if (
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setPreviewContent(
          <div className="flex justify-center items-center w-full h-full">
            <FaFileWord size={100} className="text-blue-600" />
          </div>
        );
        fileTypeDisplay = "Word";
      } else {
        setError("Type de fichier non supporté.");
        return;
      }

      setSelectedFile({ file, size: file.size, displayType: fileTypeDisplay });
      setError("");
    }
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;
    if (value.length > 75) {
      setError("Le titre ne peut pas dépasser 75 caractères.");
    } else {
      setFileTitle(value);
      setError("");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewContent(null);
    setFileTitle("Titre du document");
    setError("");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier avant de téléverser.");
      return;
    }

    onFileUpload?.({
      file: selectedFile.file,
      title: fileTitle,
    });

    handleRemoveFile();
  };

  return (
    <div className="p-4 w-full max-w-4xl mx-auto flex flex-col items-center space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 w-full">
        <div className="hover:bg-slate-50 relative w-full">
          <label
            htmlFor="file-upload"
            className={`relative flex justify-center items-center w-full h-52 border-2 border-dashed border-gray-300 rounded-lg transition ${
              previewContent ? "cursor-default" : "cursor-pointer"
            }`}
          >
            {previewContent ? (
              <div className="relative w-full h-full">
                {previewContent}
                <div className="absolute top-2 left-2 max-w-72 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                  {fileTitle}
                </div>
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-70 text-black text-sm px-2 py-1 rounded">
                  {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
                </div>
                <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 text-black text-sm px-2 py-1 rounded">
                  {selectedFile?.displayType}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center">
                <p className="text-4xl font-bold">+</p>
                <p className="text-sm">Cliquez pour ajouter un fichier</p>
              </div>
            )}
            {!selectedFile && (
              <input
                id="file-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            )}
          </label>

          {selectedFile && (
            <button
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex justify-center items-center text-sm hover:bg-red-700"
              aria-label="Supprimer le fichier"
            >
              ✕
            </button>
          )}
        </div>

        {selectedFile && (
          <div className="flex flex-col w-full mt-4 md:mt-0">
            <label className="block text-sm font-medium mb-2">Titre</label>
            <input
              type="text"
              value={fileTitle}
              onChange={handleTitleChange}
              placeholder="Entrez un titre (75 caractères max.)"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md p-2"
            />
            <Button className="mt-4 w-full md:w-auto" onClick={handleUpload}>
              Enregistrer
            </Button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
    </div>
  );
}
