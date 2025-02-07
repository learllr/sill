import { useState } from "react";
import { Months } from "../../../../../shared/constants/general.js";
import IconButton from "./Design/IconButton.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

const MAX_FILE_SIZE_MB = 5;

export default function EditDocumentForm({
  document,
  onSave,
  documentType,
  onUpdate,
  isUpdating,
}) {
  const [selectedYear, setSelectedYear] = useState(document.year);
  const [selectedMonth, setSelectedMonth] = useState(document.month);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

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

    onUpdate(document.id, formData);
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

      <IconButton
        onClick={handleSubmit}
        disabled={isUpdating}
        variant="blue"
        className="w-full"
      >
        {isUpdating ? "Modification en cours..." : "Modifier"}
      </IconButton>
    </div>
  );
}
