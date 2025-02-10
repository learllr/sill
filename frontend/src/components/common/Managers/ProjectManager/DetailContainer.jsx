import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import ProjectDetails from "./ProjectDetails.jsx";
import EditProjectForm from "./EditProjectForm.jsx";
import NewProjectForm from "./NewProjectForm.jsx";

export default function DetailContainer({
  onClose,
  isNew,
  project,
  addMutation,
  deleteMutation,
  updateMutation,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce projet ?")) {
      deleteMutation.mutate(project.id);
      onClose();
    }
  };

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh] overflow-auto">
      <div className="flex justify-end space-x-2">
        {!isNew && !isEditing && (
          <IconButton
            onClick={handleDelete}
            variant="red"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Suppression..." : <Trash2 />}
          </IconButton>
        )}

        {!isNew && !isEditing && (
          <IconButton onClick={() => setIsEditing(true)} variant="blue">
            <Pencil />
          </IconButton>
        )}

        <IconButton onClick={onClose} variant="gray">
          <X />
        </IconButton>
      </div>

      <div className="w-72 mx-auto">
        {isNew ? (
          <NewProjectForm onSave={onClose} addMutation={addMutation} />
        ) : isEditing ? (
          <EditProjectForm
            project={project}
            onSave={onClose}
            onUpdate={(projectId, formData) => {
              updateMutation.mutate({ projectId, formData });
              onClose();
            }}
            isUpdating={updateMutation.isLoading}
          />
        ) : (
          <ProjectDetails project={project} />
        )}
      </div>
    </div>
  );
}
