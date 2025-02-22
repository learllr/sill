import { Pencil } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../../../axiosConfig.js";
import ActionButton from "../../common/Design/Buttons/ActionButton.jsx";
import { useMessageDialog } from "../../contexts/MessageDialogContext.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function SignatureStamp() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasNewFile, setHasNewFile] = useState(false);
  const queryClient = useQueryClient();
  const { showMessage } = useMessageDialog();

  const {
    data: signatureData,
    isLoading,
    isError,
  } = useQuery("signature", fetchSignature, {
    onSuccess: (data) => {
      if (!hasNewFile && data?.filePath) {
        setPreview(`${BASE_URL}/uploads/${data.filePath}`);
      }
    },
    onError: () => setPreview(null),
    retry: false,
  });

  const uploadMutation = useMutation(uploadSignature, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("signature");
      setPreview(`${BASE_URL}/uploads/${data.filePath}`);
      setIsEditing(false);
      setFile(null);
      setHasNewFile(false);
      showMessage("success", "Tampon de signature mis à jour avec succès !");
    },
    onError: (error) => {
      showMessage(
        "error",
        error.response?.data?.error ||
          "Erreur lors du téléchargement du tampon."
      );
    },
  });

  async function fetchSignature() {
    try {
      const response = await axios.get("/signature");
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  }

  async function uploadSignature(file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("/signature", formData);
    return response.data;
  }

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
      setHasNewFile(true);
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (file) uploadMutation.mutate(file);
  };

  const handleCancel = () => {
    setFile(null);
    setHasNewFile(false);
    setPreview(
      signatureData?.filePath
        ? `${BASE_URL}/uploads/${signatureData.filePath}`
        : null
    );
    setIsEditing(false);
  };

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4 px-4 ">Tampon de signature</h1>

      <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto justify-center">
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <>
            {preview && !isEditing ? (
              <div className="relative border p-2">
                <img
                  src={preview}
                  alt="Tampon de signature"
                  className="max-w-xs"
                />
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-full p-2 transition absolute top-2 right-2"
                >
                  <Pencil size={16} />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {preview && (
                  <div className="border p-2">
                    <img
                      src={preview}
                      alt="Aperçu du tampon"
                      className="max-w-xs"
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <ActionButton
                    onClick={handleSave}
                    disabled={!file || uploadMutation.isLoading}
                    variant="green"
                  >
                    {uploadMutation.isLoading
                      ? "Enregistrement..."
                      : "Enregistrer"}
                  </ActionButton>
                  <ActionButton onClick={handleCancel} variant="red">
                    Annuler
                  </ActionButton>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
