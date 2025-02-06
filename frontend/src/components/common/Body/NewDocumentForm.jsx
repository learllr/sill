import { useState } from "react";
import { useMutation } from "react-query";
import axios from "../../../axiosConfig.js";
import { Months } from "../../../../../shared/constants/general.js";
import DocumentPreview from "./DocumentPreview.jsx";

const MAX_FILE_SIZE_MB = 5;

export default function NewDocumentForm({ onSave, documentType }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(Months[0]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post("/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      onSave();
    },
    onError: () => {
      setError("Erreur lors de l'ajout du document.");
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
    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("year", selectedYear);
    formData.append("month", selectedMonth);
    formData.append("type", documentType);

    mutation.mutate(formData);
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        Ajouter un nouveau document
      </h1>

      <DocumentPreview file={file} />
      <label className="block">
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full mt-1 border rounded-md p-2"
        />
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

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
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Ajout en cours..." : "Ajouter"}
      </button>
    </div>
  );
}
