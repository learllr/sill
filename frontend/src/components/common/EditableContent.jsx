import React, { useState } from "react";
import FileUploader from "./FileUploader.jsx";

export default function EditableContent({
  initialContent,
  documentTypeId,
  onUploadComplete,
}) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);

  const uploadDocumentToDatabase = async (fileData) => {
    try {
      const response = await fetch("/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: fileData.title || "Document",
          typeId: documentTypeId,
          imagePath: fileData.url,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Erreur lors de l'ajout du document dans la base de données"
        );
      }

      const document = await response.json();
      return document;
    } catch (error) {
      console.error("Erreur lors de l'ajout du document :", error);
      throw error;
    }
  };

  const handleFileUpload = async (data) => {
    try {
      const fileUrl = URL.createObjectURL(data.file);

      await uploadDocumentToDatabase({
        title: data.title || "Document",
        url: fileUrl,
      });

      setContent(fileUrl);
      setIsEditing(false);

      if (onUploadComplete) {
        onUploadComplete(data);
      }
    } catch (error) {
      console.error("Erreur lors du téléversement :", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div>
      {isEditing ? (
        <FileUploader onFileUpload={handleFileUpload} />
      ) : content ? (
        <div className="relative">
          <img
            src={content}
            alt="Contenu affiché"
            className="w-full rounded-lg"
          />
          <button
            onClick={handleEdit}
            className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-6 h-6 flex justify-center items-center text-sm hover:bg-blue-700"
            aria-label="Modifier le contenu"
          >
            ✎
          </button>
        </div>
      ) : (
        <button
          onClick={handleEdit}
          className="w-full h-52 border-2 border-dashed border-gray-300 flex justify-center items-center rounded-lg text-gray-500 hover:bg-gray-50"
        >
          <span className="text-sm">Cliquez pour ajouter un contenu</span>
        </button>
      )}
    </div>
  );
}
