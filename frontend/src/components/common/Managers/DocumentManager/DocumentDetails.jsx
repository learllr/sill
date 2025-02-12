import { formatDateTime } from "../../../../../../shared/utils/dateUtils.js";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

export default function DocumentDetails({ document, employeeId }) {
  const { participants } = useParticipants(!!document?.participantId);
  const { projects } = useProjects(!!document?.projectId);

  const participantName =
    participants.find((p) => p.id === document?.participantId)?.name || "Aucun";
  const projectName =
    projects.find((p) => p.id === document?.projectId)?.name || "Aucun";

  const isInvoice = document?.type === "Factures";
  const isQuote = document?.type === "Devis";

  const invoiceInfo = document?.invoiceInfos?.[0] || {};
  const quoteInfo = document?.quoteInfos?.[0] || {};

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-lg text-center font-semibold">Détails du document</h2>
      <DocumentPreview file={document} />
      <div className="flex flex-col space-y-1">
        {!employeeId && (
          <>
            <p>
              <strong>Année :</strong> {document?.year || "Non renseigné"}
            </p>
            <p>
              <strong>Mois :</strong> {document?.month || "Non renseigné"}
            </p>
          </>
        )}
      </div>

      {/* Affichage spécifique pour les factures */}
      {isInvoice && (
        <div className="mt-2">
          <p>
            <strong>Numéro de facture :</strong>{" "}
            {invoiceInfo.invoiceNumber || "Non renseigné"}
          </p>
          <p>
            <strong>Lot :</strong> {invoiceInfo.lot || "Non renseigné"}
          </p>
          <p>
            <strong>Date de paiement :</strong>{" "}
            {invoiceInfo.paidOn
              ? new Date(invoiceInfo.paidOn).toLocaleDateString("fr-FR")
              : "Non renseignée"}
          </p>
          <p>
            <strong>Méthode de paiement :</strong>{" "}
            {invoiceInfo.paymentMethod || "Non renseigné"}
          </p>
          <p>
            <strong>RG (5%) :</strong>{" "}
            {invoiceInfo.RG ? "Appliqué" : "Non appliqué"}
          </p>
          <p>
            <strong>Prorata (2%) :</strong>{" "}
            {invoiceInfo.prorata ? "Appliqué" : "Non appliqué"}
          </p>
          <p>
            <strong>Bonne fin de chantier (5%) :</strong>{" "}
            {invoiceInfo.finalCompletion ? "Appliqué" : "Non appliqué"}
          </p>
          <p>
            <strong>Remarques :</strong> {invoiceInfo.remarks || "Aucune"}
          </p>
        </div>
      )}

      {/* Affichage spécifique pour les devis */}
      {isQuote && (
        <div className="mt-2">
          <p>
            <strong>Numéro de devis :</strong>{" "}
            {quoteInfo.quoteNumber || "Non renseigné"}
          </p>
          <p>
            <strong>Lot :</strong> {quoteInfo.lot || "Non renseigné"}
          </p>
          <p>
            <strong>Date d'envoi :</strong>{" "}
            {quoteInfo.sentOn
              ? new Date(quoteInfo.sentOn).toLocaleDateString("fr-FR")
              : "Non renseignée"}
          </p>
          <p>
            <strong>Remarques :</strong> {quoteInfo.remarks || "Aucune"}
          </p>
          <p>
            <strong>En attente :</strong> {quoteInfo.status || "En attente"}
          </p>
        </div>
      )}

      <div className="text-gray-600 text-center">
        <p>
          <strong>Créé le :</strong> {formatDateTime(document?.createdAt)}
        </p>
        <p>
          <strong>Modifié le :</strong> {formatDateTime(document?.updatedAt)}
        </p>
      </div>
    </div>
  );
}
