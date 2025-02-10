import { formatDateTime } from "../../../../../../shared/utils/dateUtils.js";

export default function ProjectDetails({ project }) {
  return (
    <div className="p-2 space-y-4">
      <h2 className="text-lg text-center font-semibold">Détails du chantier</h2>

      <div className="flex flex-col space-y-1">
        <p>
          <strong>Nom :</strong> {project?.name || "Non renseigné"}
        </p>
        <p>
          <strong>Client :</strong> {project?.client || "Non renseigné"}
        </p>
        <p>
          <strong>Statut :</strong> {project?.status || "Non renseigné"}
        </p>
        <p>
          <strong>Description :</strong> {project?.description || "Aucune"}
        </p>
      </div>

      <div className="text-gray-600 text-center">
        <p>
          <strong>Créé le :</strong> {formatDateTime(project?.createdAt)}
        </p>
        <p>
          <strong>Mis à jour le :</strong> {formatDateTime(project?.updatedAt)}
        </p>
      </div>
    </div>
  );
}
