import { formatDateTime } from "../../../../../shared/utils/dateUtils.js";
import DocumentPreview from "./DocumentPreview";

export default function DocumentDetails({ document }) {
  return (
    <div className="p-2 space-y-4">
      <h2 className="text-lg text-center font-semibold">Détails du document</h2>
      <DocumentPreview file={document} />
      <div className="flex flex-col space-y-1">
        <p>
          <strong>Année :</strong> {document?.year}
        </p>
        <p>
          <strong>Mois :</strong> {document?.month}
        </p>
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
