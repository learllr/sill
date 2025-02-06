import { useState } from "react";
import { useMutation } from "react-query";
import axios from "../../../axiosConfig.js";
import { Months } from "../../../../../shared/constants/general.js";
import DocumentPreview from "./DocumentPreview.jsx";

const MAX_FILE_SIZE_MB = 5;

export default function EditDocumentForm({ document, onSave, documentType }) {
  const [selectedYear, setSelectedYear] = useState(document.year);
  const [selectedMonth, setSelectedMonth] = useState(document.month);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.put(`/document/${document.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      setSuccess("Document mis à jour avec succès !");
      setTimeout(() => {
        setSuccess("");
        onSave();
      }, 1500);
    },
    onError: () => {
      setError("Erreur lors de la mise à jour du document.");
    },
  });

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const fileSizeMB = uploadedFile.size / (1024 * 1024);

      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        setError(`La taille du fichier dépasse ${MAX_FILE_SIZE_MB} Mo.`);
        setFile(null);
        return;
      }

      setError("");
      setFile(uploadedFile);
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("year", selectedYear);
    formData.append("month", selectedMonth);
    formData.append("type", documentType);
    if (file) {
      formData.append("file", file);
    }

    mutation.mutate(formData);
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        Modifier le document
      </h1>

      <DocumentPreview file={file || { path: document.path }} />

      <label className="block">
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full mt-1 border rounded-md p-2"
        />
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <label className="block">
        <span className="text-gray-700">Année</span>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          min="2000"
          className="block w-full mt-1 border rounded-md p-2"
        />
      </label>

      <label className="block">
        <span className="text-gray-700">Mois</span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="block w-full mt-1 border rounded-md p-2"
        >
          {Months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Modification en cours..." : "Modifier"}
      </button>
    </div>
  );
}
