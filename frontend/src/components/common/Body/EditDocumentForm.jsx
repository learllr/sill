import { useState } from "react";
import { Months } from "../../../../../shared/constants/general.js";
import { useParticipants } from "../../../hooks/useParticipants";
import { useProjects } from "../../../hooks/useProjects";
import Combobox from "../Buttons/Combobox.jsx";
import IconButton from "./Design/IconButton.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

const MAX_FILE_SIZE_MB = 5;

export default function EditDocumentForm({
  document,
  onSave,
  documentType,
  onUpdate,
  isUpdating,
  isParticipant,
  isProject,
}) {
  const [selectedYear, setSelectedYear] = useState(document.year);
  const [selectedMonth, setSelectedMonth] = useState(document.month);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState(
    document.participantId || null
  );
  const [selectedProject, setSelectedProject] = useState(
    document.projectId || null
  );

  const { participants, isLoadingParticipants } =
    useParticipants(isParticipant);
  const { projects, isLoadingProjects } = useProjects(isProject);

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

    if (isParticipant) {
      formData.append("participantId", selectedParticipant ?? "");
    }

    if (isProject) {
      formData.append("projectId", selectedProject ?? "");
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

      {isParticipant && (
        <label className="block">
          <span className="text-gray-700">Intervenant</span>
          <Combobox
            subjects={participants}
            onSelect={(value) => setSelectedParticipant(value)}
            placeholder="Sélectionnez un intervenant..."
            defaultValue={selectedParticipant}
            isLoading={isLoadingParticipants}
          />
        </label>
      )}

      {isProject && (
        <label className="block">
          <span className="text-gray-700">Chantier</span>
          <Combobox
            subjects={projects}
            onSelect={(value) => setSelectedProject(value)}
            placeholder="Sélectionnez un chantier..."
            defaultValue={selectedProject}
            isLoading={isLoadingProjects}
          />
        </label>
      )}

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
