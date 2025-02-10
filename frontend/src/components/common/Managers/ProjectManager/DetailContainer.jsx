import { X } from "lucide-react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import NewProjectForm from "./NewProjectForm.jsx";
import EditProjectForm from "./EditProjectForm.jsx";

export default function DetailContainer({ onClose, isNew, addMutation }) {
  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh] overflow-auto">
      <div className="flex justify-end">
        <IconButton onClick={onClose} variant="gray">
          <X />
        </IconButton>
      </div>

      <div className="w-72 mx-auto">
        {isNew && <NewProjectForm onSave={onClose} addMutation={addMutation} />}
      </div>
    </div>
  );
}
