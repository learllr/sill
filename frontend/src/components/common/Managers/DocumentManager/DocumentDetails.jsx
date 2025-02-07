import { formatDateTime } from "../../../../../../shared/utils/dateUtils.js";
import { useParticipants } from "../../../../hooks/useParticipants.jsx";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import DocumentPreview from "./DocumentPreview.jsx";

export default function DocumentDetails({
  document,
  isParticipant,
  isProject,
}) {
  const { participants } = useParticipants(!!document?.participantId);
  const { projects } = useProjects(!!document?.projectId);

  const participantName =
    participants.find((p) => p.id === document?.participantId)?.name || "Aucun";
  const projectName =
    projects.find((p) => p.id === document?.projectId)?.name || "Aucun";

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
        {isParticipant && (
          <p>
            <strong>Intervenant :</strong> {participantName}
          </p>
        )}
        {isProject && (
          <p>
            <strong>Chantier :</strong> {projectName}
          </p>
        )}
      </div>
      <div className="text-gray-600 text-center ">
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
