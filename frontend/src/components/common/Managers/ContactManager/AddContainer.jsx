import { X } from "lucide-react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import NewContactForm from "./NewContactForm.jsx";

export default function AddContainer({
  onClose,
  isNew,
  contactType,
  addMutation,
}) {
  return (
    <div className="border p-4 flex flex-col space-y-3 h-[80vh] overflow-auto">
      <div className="flex justify-end space-x-2">
        <IconButton onClick={onClose} variant="gray">
          <X />
        </IconButton>
      </div>

      <div className="w-72 mx-auto">
        {isNew && (
          <NewContactForm
            onSave={onClose}
            contactType={contactType}
            addMutation={addMutation}
          />
        )}
      </div>
    </div>
  );
}
