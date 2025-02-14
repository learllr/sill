import { useState } from "react";
import { DocumentType } from "../../../../../../shared/constants/types.js";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

const MAX_FILE_SIZE_MB = 5;

export default function EditDocumentForm({
  document,
  onSave,
  documentType,
  onUpdate,
  isUpdating,
  employeeId,
  isCEDIG,
}) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const [formFields, setFormFields] = useState({
    name: document.name || "",
    date: document.date || "",
    projectId: document.projectId,
    participantId: document.participantId,
    invoiceNumber: document.invoiceInfos[0]?.invoiceNumber || "",
    lot: document.invoiceInfos[0]?.lot || document.quoteInfos[0]?.lot || "",
    paidOn: document.invoiceInfos[0]?.paidOn || "",
    paymentMethod: document.invoiceInfos[0]?.paymentMethod || "",
    remarks: document.remarks || "",
    sentOn: document.quoteInfos[0]?.sentOn || "",
    status: document.quoteInfos[0]?.status || "En attente",
    RG: document.invoiceInfos[0]?.RG || false,
    prorata: document.invoiceInfos[0]?.prorata || false,
    finalCompletion: document.invoiceInfos[0]?.finalCompletion || false,
    pvType: document.pvType || "Avec réserves",
  });

  const { projects } = useProjects();
  const { participants } = useParticipants();

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
    const formData = new FormData();

    formData.append("name", formFields.name);
    formData.append("type", isCEDIG ? DocumentType.FACTURES : documentType);

    if (!employeeId) {
      formData.append("date", formFields.date);
    }

    if (file) {
      formData.append("file", file);
    }

    if (isCEDIG) {
      formData.append("projectId", formFields.projectId);
      formData.append("participantId", formFields.participantId);
    }

    if (documentType === DocumentType.FACTURES) {
      formData.append("invoiceNumber", formFields.invoiceNumber);
      formData.append("lot", formFields.lot);
      formData.append("paidOn", formFields.paidOn);
      formData.append("paymentMethod", formFields.paymentMethod);
      formData.append("RG", formFields.RG);
      formData.append("prorata", formFields.prorata);
      formData.append("finalCompletion", formFields.finalCompletion);
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

      {!employeeId && (
        <>
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
            <span className="text-gray-700">Date</span>
            <input
              type="date"
              name="date"
              value={formFields.date}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            />
          </label>
        </>
      )}

      {isCEDIG && (
        <>
          <label className="block">
            <span className="text-gray-700">Chantier</span>
            <select
              name="projectId"
              value={formFields.projectId || ""}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            >
              <option value="">Sélectionner un chantier</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Intervenant</span>
            <select
              name="participantId"
              value={formFields.participantId || ""}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            >
              <option value="">Sélectionner un intervenant</option>
              {participants
                .filter((p) => ["Client", "Fournisseur"].includes(p.type))
                .map((participant) => (
                  <option key={participant.id} value={participant.id}>
                    {participant.name}
                  </option>
                ))}
            </select>
          </label>
        </>
      )}

      {(documentType === DocumentType.FACTURES ||
        documentType === DocumentType.DEVIS ||
        isCEDIG) && (
        <>
          <label className="block">
            <span className="text-gray-700">Numéro</span>
            <input
              type="text"
              name="invoiceNumber"
              value={formFields.invoiceNumber || ""}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Lot</span>
            <input
              type="text"
              name="lot"
              value={formFields.lot || ""}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            />
          </label>

          {(documentType === DocumentType.FACTURES || isCEDIG) && (
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
                  value={formFields.paymentMethod || ""}
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
                  value={formFields.status || ""}
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
            value={formFields.pvType || ""}
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

      <IconButton
        onClick={handleSubmit}
        disabled={isUpdating}
        variant="blue"
        className="w-full"
      >
        Modifier
      </IconButton>
    </div>
  );
}
