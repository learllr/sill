import { X } from "lucide-react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import NewProjectForm from "./NewProjectForm.jsx";
import ParticipantSelector from "./ParticipantSelector.jsx";

export default function DetailContainer({
  onClose,
  isNew,
  addMutation,
  projectId,
  selectedMainTab,
  projects,
}) {
  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh] overflow-auto">
      <div className="flex justify-end">
        <IconButton onClick={onClose} variant="gray">
          <X />
        </IconButton>
      </div>

      <div className="w-72 mx-auto">
        {isNew ? (
          projectId ? (
            <ParticipantSelector
              projectId={projectId}
              participantType={selectedMainTab}
              onClose={onClose}
              onAssign={(selectedIds) =>
                console.log("Participants sélectionnés:", selectedIds)
              }
              project={projects.find((p) => p.id === Number(projectId))}
            />
          ) : (
            <NewProjectForm onSave={onClose} addMutation={addMutation} />
          )
        ) : null}
      </div>
    </div>
  );
}
