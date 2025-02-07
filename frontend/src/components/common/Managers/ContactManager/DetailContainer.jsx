import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import ContactDetails from "./ContactDetails.jsx";
import EditContactForm from "./EditContactForm.jsx";
import NewContactForm from "./NewContactForm.jsx";

export default function DetailContainer({
  onClose,
  isNew,
  contactType,
  contact,
  addMutation,
  deleteMutation,
  updateMutation,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce contact ?")) {
      deleteMutation.mutate(contact.id);
      onClose();
    }
  };

  return (
    <div className="border p-4 flex flex-col space-y-3 h-[64vh] overflow-auto">
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
          <NewContactForm
            onSave={onClose}
            contactType={contactType}
            addMutation={addMutation}
          />
        ) : isEditing ? (
          <EditContactForm
            contact={contact}
            onSave={onClose}
            contactType={contactType}
            onUpdate={(contactId, formData) => {
              updateMutation.mutate({ contactId, formData });
              onClose();
            }}
            isUpdating={updateMutation.isLoading}
          />
        ) : (
          <ContactDetails contact={contact} contactType={contactType} />
        )}
      </div>
    </div>
  );
}
