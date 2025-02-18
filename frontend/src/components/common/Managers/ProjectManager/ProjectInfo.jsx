import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import { useUser } from "../../../contexts/UserContext";
import ConfirmDialog from "../../../dialogs/ConfirmDialog.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import EditProjectForm from "./EditProjectForm.jsx";

export default function ProjectInfo({ projectId }) {
  const navigate = useNavigate();
  const { projects, isLoading, isError, updateProject, deleteProject } =
    useProjects();
  const { roleId } = useUser();
  const project = projects?.find((p) => p.id === parseInt(projectId, 10));

  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (isError || !project) {
      navigate("/chantiers");
    }
  }, [isError, project, navigate]);

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteProject.mutate(project.id, {
      onSuccess: () => navigate("/chantiers"),
    });
    setIsConfirmOpen(false);
  };

  const handleUpdate = (updatedData) => {
    updateProject.mutate(
      { projectId: project.id, updatedData },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  return (
    <div className="border p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Informations du projet</h2>
        <div className="flex space-x-2">
          {roleId < 3 && (
            <IconButton
              onClick={handleDelete}
              variant="red"
              disabled={deleteProject.isLoading}
            >
              {deleteProject.isLoading ? "Suppression..." : <Trash2 />}
            </IconButton>
          )}
          <IconButton onClick={() => setIsEditing(!isEditing)} variant="blue">
            <Pencil />
          </IconButton>
        </div>
      </div>

      {isEditing ? (
        <EditProjectForm
          project={project}
          onSave={() => setIsEditing(false)}
          onUpdate={handleUpdate}
          isUpdating={updateProject.isLoading}
        />
      ) : (
        <>
          <p>
            <strong>Nom :</strong> {project?.name}
          </p>
          <p>
            <strong>Statut :</strong> {project?.status}
          </p>
          <h2 className="text-lg font-semibold py-4 mt-2">Marché</h2>
          <p>
            <strong>Client :</strong>{" "}
            {project && project.clientId
              ? project.clients?.find(
                  (client) => client.id === project.clientId
                )?.name || "Client inconnu"
              : "Aucun"}
          </p>
        </>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message="Voulez-vous vraiment supprimer ce projet ?"
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
