import React, { useEffect, useState } from "react";
import axios from "../../../axiosConfig.js";
import FileUploader from "./FileUploader.jsx";
import FileDisplay from "./FileDisplay.jsx";

export default function EditableContent({
  documentTypeId,
  onUploadComplete,
  isNew = false,
  isEditing,
  setIsEditing,
}) {
  const [loading, setLoading] = useState(!isNew);
  const [existingFileData, setExistingFileData] = useState([]);

  const fetchDocumentByType = async () => {
    if (isNew) return;

    try {
      const response = await axios.get(`/document/type/${documentTypeId}`);
      if (response.data && response.data.documents) {
        const documents = response.data.documents;
        setExistingFileData(
          documents.map((doc) => ({
            id: doc.id,
            fileName: doc.imagePath,
            title: doc.title || "Document",
          }))
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des documents :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentByType();
  }, [documentTypeId, isNew]);

  const handleFileUpload = async (data) => {
    try {
      if (data) {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("title", data.title || "Document");
        formData.append("typeId", documentTypeId);

        const response = await axios.post("/document", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedDocument = response.data.document;

        setExistingFileData([
          {
            id: uploadedDocument.id,
            fileName: uploadedDocument.imagePath,
            title: uploadedDocument.title,
          },
        ]);

        if (onUploadComplete) {
          onUploadComplete(uploadedDocument);
        }

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
    }
  };

  const handleRemoveFile = async (fileId) => {
    try {
      await axios.delete(`/document/${fileId}`);
      setExistingFileData([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier :", error);
    }
  };

  if (loading) {
    return <p className="text-sm">Chargement...</p>;
  }

  return (
    <div className="w-full text-center">
      {isEditing ? (
        <FileUploader
          onFileUpload={handleFileUpload}
          file={existingFileData[0]}
          onRemoveFile={() => handleRemoveFile(existingFileData[0]?.id)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <FileDisplay file={existingFileData[0] || null} />
      )}
    </div>
  );
}
