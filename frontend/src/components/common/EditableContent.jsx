import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaFilePdf, FaFileWord, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import axios from "../../axiosConfig.js";
import FileUploader from "./FileUploader.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function EditableContent({ documentTypeId, onUploadComplete }) {
  const [content, setContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingFileData, setExistingFileData] = useState(null);

  const fetchDocumentByType = async () => {
    try {
      const response = await axios.get(`/document/type/${documentTypeId}`);
      if (response.data && response.data.imagePath) {
        setContent(response.data.imagePath);
        setExistingFileData({
          id: response.data.id,
          fileName: response.data.imagePath,
          title: response.data.title || "Document",
        });
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
      if (data) {
        const uploadedDocument = await uploadDocumentToServer(data);
        setContent(uploadedDocument.imagePath);
        setExistingFileData({
          id: uploadedDocument.id,
          fileName: uploadedDocument.imagePath,
          title: uploadedDocument.title,
        });
        setIsEditing(false);

        if (onUploadComplete) {
          onUploadComplete(uploadedDocument);
        }
      } else {
        setContent(null);
        setExistingFileData(null);
        setIsEditing(true);
      }
    } catch (error) {
      console.error(
        "Erreur lors du téléversement ou de la suppression :",
        error
      );
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleRemoveFile = async () => {
    try {
      if (existingFileData && existingFileData.id) {
        await axios.delete(`/document/${existingFileData.id}`);
        setContent(null);
        setExistingFileData(null);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du fichier :", error);
    }
  };

  const getFilePreview = (fileName) => {
    const fileType = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png"].includes(fileType)) {
      return (
        <img
          src={`${BASE_URL}/uploads/${fileName}`}
          alt="Contenu affiché"
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
        <FileUploader
          onFileUpload={handleFileUpload}
          defaultData={existingFileData}
        />
      ) : content ? (
        <div className="relative max-w-sm mx-auto flex items-center justify-center">
          <a
            href={`${BASE_URL}/uploads/${content}`}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="w-96 h-56 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 shadow-md"
          >
            {getFilePreview(content)}
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
              onClick={handleRemoveFile}
              className="rounded-full w-8 h-8 flex justify-center items-center [&_svg]:!size-3"
              variant="destructive"
              aria-label="Supprimer le contenu"
            >
              <FaTrashAlt />
            </Button>
          </div>
        </div>
      ) : (
        <FileUploader onFileUpload={handleFileUpload} />
      )}
    </div>
  );
}
