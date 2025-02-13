import { useState } from "react";
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
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [formFields, setFormFields] = useState({
    name: "",
    date: "",
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
    pvType: "Avec réserves",
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

    if (!formFields.date) {
      setError("La date est obligatoire.");
      return;
    }

    const formData = new FormData();

    if (!isCEDIG) {
      formData.append("file", file);
    }

    formData.append("name", formFields.name);
    formData.append("date", formFields.date);
    formData.append("type", documentType);

    if (isCEDIG) {
      formData.append("documentIds", JSON.stringify(selectedDocuments));
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
      formData.append("RG", formFields.RG);
      formData.append("prorata", formFields.prorata);
      formData.append("finalCompletion", formFields.finalCompletion);
      formData.append("paymentMethod", formFields.paymentMethod);
    }

    if (documentType === DocumentType.DEVIS) {
      formData.append("quoteNumber", formFields.invoiceNumber);
      formData.append("lot", formFields.lot);
      formData.append("sentOn", formFields.sentOn);
      formData.append("status", formFields.status);
    }

    if (documentType === "PV") {
      formData.append("pvType", formFields.pvType);
    }

    formData.append("remarks", formFields.remarks);

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
      {isCEDIG && (
        <p className="text-center">
          Coche les documents à insérer dans l'envoi{" "}
        </p>
      )}

      <label className="block">
        <span className="text-gray-700">Nom</span>
        <input
          type="text"
          name="name"
          value={formFields.name}
          onChange={handleChange}
          className="block w-full mt-1 border rounded-md p-2"
        />
      </label>
      <label className="block">
        <span className="text-gray-700">
          Date <span className="text-red-500">*</span>
        </span>
        <input
          type="date"
          name="date"
          value={formFields.date}
          onChange={handleChange}
          className="block w-full mt-1 border rounded-md p-2"
          required
        />
      </label>

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

          {documentType === DocumentType.FACTURES && (
            <>
              <label className="block">
                <span className="text-gray-700">Date de paiement</span>
                <input
                  type="date"
                  name="paidOn"
                  value={formFields.paidOn}
                  onChange={handleChange}
                  className="block w-full mt-1 border rounded-md p-2"
                />
              </label>

              <label className="block">
                <span className="text-gray-700">Méthode de paiement</span>
                <select
                  name="paymentMethod"
                  value={formFields.paymentMethod}
                  onChange={handleChange}
                  className="block w-full mt-1 border rounded-md p-2"
                >
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                </select>
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  name="RG"
                  checked={formFields.RG}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">RG (5%)</span>
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  name="prorata"
                  checked={formFields.prorata}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Prorata (2%)</span>
              </label>

              <label className="block">
                <input
                  type="checkbox"
                  name="finalCompletion"
                  checked={formFields.finalCompletion}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">
                  Bonne fin de chantier (5%)
                </span>
              </label>
            </>
          )}

          {documentType === DocumentType.DEVIS && (
            <>
              <label className="block">
                <span className="text-gray-700">Date d'envoi</span>
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

      <label className="block">
        <span className="text-gray-700">Remarques</span>
        <textarea
          name="remarks"
          value={formFields.remarks}
          onChange={handleChange}
          className="block w-full mt-1 border rounded-md p-2"
        />
      </label>

      <IconButton onClick={handleSubmit} className="w-full" variant="green">
        Ajouter
      </IconButton>
    </div>
  );
}
