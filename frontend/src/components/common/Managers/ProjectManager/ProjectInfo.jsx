import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../../../hooks/useProjects.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import Loading from "../../Design/Loading.jsx";
import EditProjectForm from "./EditProjectForm.jsx";

export default function ProjectInfo({ projectId }) {
  const navigate = useNavigate();
  const { projects, isLoading, isError, updateProject, deleteProject } =
    useProjects();
  const project = projects?.find((p) => p.id === parseInt(projectId, 10));

  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <Loading />;
  if (isError || !project)
    return <p className="text-red-500 text-center">Projet introuvable.</p>;

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      deleteProject.mutate(project.id, {
        onSuccess: () => navigate("/chantiers"),
      });
    }
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
          <IconButton
            onClick={handleDelete}
            variant="red"
            disabled={deleteProject.isLoading}
          >
            {deleteProject.isLoading ? "Suppression..." : <Trash2 />}
          </IconButton>
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
            <strong>Nom :</strong> {project.name}
          </p>
          <p>
            <strong>Statut :</strong> {project.status}
          </p>
          <h2 className="text-lg font-semibold py-4 mt-2">Marché</h2>
          <p>
            <strong>Client :</strong>{" "}
            {project.clientId
              ? project.clients?.find(
                  (client) => client.id === project.clientId
                )?.name
              : "Aucun"}
          </p>
        </>
      )}
    </div>
  );
}
