import { useState } from "react";
import { Months } from "../../../../../../shared/constants/general.js";
import { DocumentType } from "../../../../../../shared/constants/types.js";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

const MAX_FILE_SIZE_MB = 5;

export default function NewDocumentForm({
  onSave,
  documentType,
  addMutation,
  employeeId,
  participantId,
  projectId,
  isCEDIG,
  selectedDocuments,
}) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(Months[0]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [formFields, setFormFields] = useState({
    invoiceNumber: "",
    lot: "",
    paidOn: "",
    sentOn: "",
    remarks: "",
    status: "En attente",
    RG: false,
    prorata: false,
    finalCompletion: false,
    paymentMethod: "Virement",
    pvType: "Réserve",
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!isCEDIG && !file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();

    if (!isCEDIG) {
      formData.append("file", file);
    }
    formData.append("year", selectedYear);
    formData.append("month", selectedMonth);
    formData.append("type", documentType);

    if (isCEDIG) {
      formData.append("documentIds", JSON.stringify(selectedDocuments));
      formData.append("projectId", projectId);
    }

    if (employeeId) {
      formData.append("employeeId", employeeId);
    }

    if (participantId) {
      formData.append("participantId", participantId);
    }

    if (projectId) {
      formData.append("projectId", projectId);
    }

    if (documentType === DocumentType.FACTURES) {
      formData.append("invoiceNumber", formFields.invoiceNumber);
      formData.append("lot", formFields.lot);
      formData.append("paidOn", formFields.paidOn);
      formData.append("remarks", formFields.remarks);
      formData.append("RG", formFields.RG);
      formData.append("prorata", formFields.prorata);
      formData.append("finalCompletion", formFields.finalCompletion);
      formData.append("paymentMethod", formFields.paymentMethod);
    }

    if (documentType === DocumentType.DEVIS) {
      formData.append("quoteNumber", formFields.invoiceNumber);
      formData.append("lot", formFields.lot);
      formData.append("sentOn", formFields.sentOn);
      formData.append("remarks", formFields.remarks);
      formData.append("status", formFields.status);
    }

    if (documentType === "PV") {
      formData.append("pvType", formFields.pvType);
    }

    addMutation.mutate(formData, {
      onSuccess: onSave,
      onError: () => setError("Erreur lors de l'ajout du document."),
    });
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        {!isCEDIG ? "Ajouter un nouveau document" : "Ajouter un nouvel envoi"}
      </h1>

      {!isCEDIG && (
        <>
          <DocumentPreview file={file} />
          <label className="block">
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full mt-1 border rounded-md p-2"
            />
          </label>
        </>
      )}

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

      {(documentType === DocumentType.FACTURES ||
        documentType === DocumentType.DEVIS) && (
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
        </>
      )}

      {documentType === "PV" && (
        <label className="block">
          <span className="text-gray-700">Type de PV</span>
          <select
            name="pvType"
            value={formFields.pvType}
            onChange={handleChange}
            className="block w-full mt-1 border rounded-md p-2"
          >
            <option value="Avec réserves">Avec réserves</option>
            <option value="Sans réserves">Sans réserves</option>
          </select>
        </label>
      )}

      <IconButton onClick={handleSubmit} className="w-full" variant="green">
        Ajouter
      </IconButton>
    </div>
  );
}
