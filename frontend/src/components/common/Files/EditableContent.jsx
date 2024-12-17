import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaFilePdf, FaFileWord, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import axios from "../../../axiosConfig.js";
import FileUploader from "./FileUploader.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function EditableContent({
  documentTypeId,
  onUploadComplete,
  isNew = false,
}) {
  const [content, setContent] = useState([]);
  const [isEditing, setIsEditing] = useState(isNew);
  const [loading, setLoading] = useState(!isNew);
  const [existingFileData, setExistingFileData] = useState([]);

  const fetchDocumentByType = async () => {
    if (isNew) return;

    try {
      const response = await axios.get(`/document/type/${documentTypeId}`);
      if (response.data && response.data.documents) {
        const documents = response.data.documents;
        setContent(documents.map((doc) => doc.imagePath));
        setExistingFileData(
          documents.map((doc) => ({
            id: doc.id,
            fileName: doc.imagePath,
            title: doc.title || "Document",
          }))
        );
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentByType();
  }, [documentTypeId, isNew]);

  const uploadDocumentToServer = async (fileData) => {
    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("title", fileData.title || "Document");
    formData.append("typeId", documentTypeId);

    const response = await axios.post("/document", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.document;
  };

  const handleFileUpload = async (data) => {
    try {
      if (data) {
        const uploadedDocument = await uploadDocumentToServer(data);
        setContent((prev) => [...prev, uploadedDocument.imagePath]);
        setExistingFileData((prev) => [
          ...prev,
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
    } catch (error) {}
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleRemoveFile = async (fileId, filePath) => {
    try {
      await axios.delete(`/document/${fileId}`);
      setContent((prev) => prev.filter((path) => path !== filePath));
      setExistingFileData((prev) => prev.filter((file) => file.id !== fileId));
    } catch (error) {}
  };

  const getFilePreview = (fileName) => {
    const fileType = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png"].includes(fileType)) {
      return (
        <img
          src={`${BASE_URL}/uploads/${fileName}`}
          alt="Aperçu du fichier"
          className="w-full rounded-lg"
        />
      );
    } else if (fileType === "pdf") {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-lg shadow-sm">
          <FaFilePdf size={50} className="text-red-600" />
        </div>
      );
    } else if (fileType === "docx" || fileType === "doc") {
      return (
        <div className="flex items-center justify-center w-full h-full bg-gray-50 rounded-lg shadow-sm">
          <FaFileWord size={50} className="text-blue-600" />
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }

  return (
    <div className="w-full text-center">
      {isEditing ? (
        <FileUploader onFileUpload={handleFileUpload} />
      ) : content.length > 0 ? (
        <div className="flex flex-col">
          {existingFileData.map((file) => (
            <div key={file.id} className="relative max-w-sm mx-auto">
              <a
                href={`${BASE_URL}/uploads/${file.fileName}`}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-96 h-56 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 shadow-md"
              >
                {getFilePreview(file.fileName)}
              </a>

              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  onClick={handleEdit}
                  className="rounded-full w-8 h-8 flex justify-center items-center [&_svg]:!size-3"
                  aria-label="Modifier le contenu"
                >
                  <FaPencilAlt />
                </Button>

                <Button
                  onClick={() => handleRemoveFile(file.id, file.fileName)}
                  className="rounded-full w-8 h-8 flex justify-center items-center [&_svg]:!size-3"
                  variant="destructive"
                  aria-label="Supprimer le contenu"
                >
                  <FaTrashAlt />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <FileUploader onFileUpload={handleFileUpload} />
      )}
    </div>
  );
}
