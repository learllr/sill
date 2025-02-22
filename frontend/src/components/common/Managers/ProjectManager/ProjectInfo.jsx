import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import { useMessageDialog } from "../../../contexts/MessageDialogContext.jsx";
import { useUser } from "../../../contexts/UserContext";
import ConfirmDialog from "../../../dialogs/ConfirmDialog.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import EditProjectForm from "./EditProjectForm.jsx";

export default function ProjectInfo({ projectId, isTrash }) {
  const navigate = useNavigate();
  const { projects, isLoading, isError, updateProject, deleteProject } =
    useProjects();
  const { roleId } = useUser();
  const project = projects?.find((p) => p.id === parseInt(projectId, 10));
  const { showMessage } = useMessageDialog();

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
    if (isTrash) {
      deleteProject.mutate(project.id, {
        onSuccess: () => {
          showMessage("success", "Chantier supprimé avec succès.");
          navigate("/corbeille");
        },
        onError: () => {
          showMessage("error", "Erreur lors de la suppression du chantier.");
        },
      });
    } else {
      updateProject.mutate(
        { projectId: project.id, updatedData: { deleted: true } },
        {
          onSuccess: () => {
            showMessage("success", "Chantier déplacé vers la corbeille.");
            navigate("/chantiers");
          },
          onError: () => {
            showMessage("error", "Erreur lors de la mise à jour du chantier.");
          },
        }
      );
    }
    setIsConfirmOpen(false);
  };

  const handleUpdate = (updatedData) => {
    updateProject.mutate(
      { projectId: project.id, updatedData },
      {
        onSuccess: () => {
          showMessage("success", "Le chantier a été mis à jour avec succès.");
          setIsEditing(false);
        },
      }
    );
  };

  return (
    <div
      className={`p-4 w-full ${isTrash ? "border border-rose-300" : "border"}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Informations du chantier</h2>
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
          {!isTrash && (
            <IconButton onClick={() => setIsEditing(!isEditing)} variant="blue">
              <Pencil />
            </IconButton>
          )}
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
        message={`Voulez-vous vraiment supprimer ${
          isTrash ? "définitivement" : ""
        } ce chantier ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
