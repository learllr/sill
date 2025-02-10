import { useState } from "react";
import { Months } from "../../../../../../shared/constants/general.js";
import { DocumentType } from "../../../../../../shared/constants/types.js";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import Combobox from "../../Design/Buttons/Combobox.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

const MAX_FILE_SIZE_MB = 5;

export default function NewDocumentForm({
  onSave,
  documentType,
  addMutation,
  isParticipant,
  isProject,
  employeeId,
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(Months[0]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formFields, setFormFields] = useState({
    invoiceNumber: "",
    lot: "",
    paidOn: "",
    remarks: "",
    sentOn: "",
    status: "En attente",
  });

  const { participants, isLoadingParticipants } = useParticipants(
    documentType,
    isParticipant
  );
  const { projects, isLoadingProjects } = useProjects(documentType, isProject);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    if (employeeId) {
      formData.append("employeeId", employeeId);
    } else {
      if (isParticipant && selectedParticipant) {
        formData.append("participantId", selectedParticipant);
      }

      if (isProject && selectedProject) {
        formData.append("projectId", selectedProject);
      }
    }

    if (documentType === DocumentType.FACTURES) {
      formData.append("invoiceNumber", formFields.invoiceNumber);
      formData.append("lot", formFields.lot);
      formData.append("paidOn", formFields.paidOn);
      formData.append("remarks", formFields.remarks);
    }

    if (
      documentType === DocumentType.DEVIS ||
      documentType === DocumentType.DEVIS_VALIDES
    ) {
      formData.append("quoteNumber", formFields.invoiceNumber);
      formData.append("lot", formFields.lot);
      formData.append("sentOn", formFields.sentOn);
      formData.append("remarks", formFields.remarks);
      formData.append("status", formFields.status);
    }

    addMutation.mutate(formData, {
      onSuccess: onSave,
      onError: () => setError("Erreur lors de l'ajout du document."),
    });
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

      {!employeeId && (
        <>
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
        </>
      )}

      {!employeeId && isParticipant && (
        <label className="block">
          <span className="text-gray-700">Intervenant</span>
          <Combobox
            subjects={participants}
            onSelect={(value) => setSelectedParticipant(value)}
            placeholder="Sélectionnez un intervenant..."
            isLoading={isLoadingParticipants}
          />
        </label>
      )}

      {!employeeId && isProject && (
        <label className="block">
          <span className="text-gray-700">Chantier</span>
          <Combobox
            subjects={projects}
            onSelect={(value) => setSelectedProject(value)}
            placeholder="Sélectionnez un chantier..."
            isLoading={isLoadingProjects}
          />
        </label>
      )}

      {(documentType === DocumentType.FACTURES ||
        documentType === DocumentType.DEVIS ||
        documentType === DocumentType.DEVIS_VALIDES) && (
        <>
          <label className="block">
            <span className="text-gray-700">Numéro</span>
            <input
              type="text"
              name="invoiceNumber"
              value={formFields.invoiceNumber}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Lot</span>
            <input
              type="text"
              name="lot"
              value={formFields.lot}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            />
          </label>

          {documentType === DocumentType.FACTURES && (
            <label className="block">
              <span className="text-gray-700">Payé le</span>
              <input
                type="date"
                name="paidOn"
                value={formFields.paidOn}
                onChange={handleChange}
                className="block w-full mt-1 border rounded-md p-2"
              />
            </label>
          )}

          {(documentType === DocumentType.DEVIS ||
            documentType === DocumentType.DEVIS_VALIDES) && (
            <>
              <label className="block">
                <span className="text-gray-700">Envoyé le</span>
                <input
                  type="date"
                  name="sentOn"
                  value={formFields.sentOn}
                  onChange={handleChange}
                  className="block w-full mt-1 border rounded-md p-2"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Statut</span>
                <select
                  name="status"
                  value={formFields.status}
                  onChange={handleChange}
                  className="block w-full mt-1 border rounded-md p-2"
                >
                  <option value="En attente">En attente</option>
                  <option value="Accepté">Accepté</option>
                  <option value="Rejeté">Rejeté</option>
                </select>
              </label>
            </>
          )}
        </>
      )}

      <IconButton
        onClick={handleSubmit}
        className="w-full"
        variant="green"
        disabled={addMutation.isLoading}
      >
        {addMutation.isLoading ? "Ajout en cours..." : "Ajouter"}
      </IconButton>
    </div>
  );
}
