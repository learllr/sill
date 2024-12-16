import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig.js";
import FileUploader from "./FileUploader.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function EditableContent({ documentTypeId, onUploadComplete }) {
  const [content, setContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocumentByType = async () => {
    try {
      const response = await axios.get(`/document/type/${documentTypeId}`);
      if (response.data && response.data.imagePath) {
        setContent(response.data.imagePath);
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du document :", error);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentByType();
  }, [documentTypeId]);

  const uploadDocumentToServer = async (fileData) => {
    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("title", fileData.title || "Document");
    formData.append("typeId", documentTypeId);

    const response = await axios.post("/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.document;
  };

  const handleFileUpload = async (data) => {
    try {
      const uploadedDocument = await uploadDocumentToServer(data);
      setContent(uploadedDocument.imagePath);
      setIsEditing(false);

      if (onUploadComplete) {
        onUploadComplete(uploadedDocument);
      }
    } catch (error) {
      console.error("Erreur lors du téléversement :", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }

  return (
    <div className="w-full max-w-md mx-auto text-center">
      {isEditing ? (
        <FileUploader onFileUpload={handleFileUpload} />
      ) : content ? (
        <div className="relative">
          <img
            src={`${BASE_URL}/uploads/${content}`}
            alt="Contenu affiché"
            className="w-full rounded-lg"
          />
          <button
            onClick={handleEdit}
            className="absolute top-2 right-2 bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center text-sm hover:bg-blue-700"
            aria-label="Modifier le contenu"
          >
            ✎
          </button>
        </div>
      ) : (
        <FileUploader onFileUpload={handleFileUpload} />
      )}
    </div>
  );
}
