import {
  formatDate,
  formatDateTime,
} from "../../../../../../shared/utils/formatUtils.js";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

export default function DocumentDetails({ document, employeeId }) {
  const isInvoice = document?.type === "Factures";
  const isQuote = document?.type === "Devis";
  const isPV = document?.type === "PV";

  const invoiceInfo = document?.invoiceInfos?.[0] || {};
  const quoteInfo = document?.quoteInfos?.[0] || {};

  const { participants } = useParticipants();
  const { projects } = useProjects();

  const participant = participants?.find(
    (p) => p.id === document.participantId
  );
  const project = projects?.find((p) => p.id === document.projectId);

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-lg text-center font-semibold">Détails du document</h2>
      <DocumentPreview file={document} />

      <div className="flex flex-col">
        {!employeeId && (
          <>
            <p>
              <strong>Nom :</strong> {document?.name || "Non renseigné"}
            </p>
            <p>
              <strong>Date :</strong>{" "}
              {formatDate(document?.date) || "Non renseigné"}
            </p>
          </>
        )}
      </div>

      <div>
        <strong>Chantier :</strong>{" "}
        {document.projectId && project ? (
          <p>{project.name}</p>
        ) : (
          "Non renseigné"
        )}
        {document.participantId && participant ? (
          <p>
            <strong>{participant.type} :</strong> {participant.name}
          </p>
        ) : (
          <p>
            <strong>Intervenant :</strong> {"Non renseigné"}
          </p>
        )}
      </div>

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
        </div>
      )}

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
            <strong>En attente :</strong> {quoteInfo.status || "En attente"}
          </p>
        </div>
      )}

      {isPV && (
        <div className="mt-2">
          <p>
            <strong>Type de PV :</strong> {document.pvType || "Non renseigné"}
          </p>
        </div>
      )}

      <p>
        <strong>Remarques :</strong> {document.remarks || "Aucune"}
      </p>

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
