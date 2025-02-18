import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContacts } from "../../../../hooks/useContacts.jsx";
import { useUser } from "../../../contexts/UserContext";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import Loading from "../../Design/Loading.jsx";
import ContactSection from "./ContactSection.jsx";
import EditContactForm from "./EditContactForm.jsx";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";

export default function ContactInfo({ sections, contactId, contactType }) {
  const navigate = useNavigate();
  const { contacts, isLoading, isError, updateMutation, deleteMutation } =
    useContacts(contactType);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { roleId } = useUser();

  const contact = contacts?.find((c) => c.id === parseInt(contactId));

  const [isEditing, setIsEditing] = useState(false);
  const [openSections, setOpenSections] = useState(
    sections ? sections.map((_, index) => index === 0) : []
  );

  if (isLoading) return <Loading />;
  if (isError || !contact)
    return (
      <p className="text-red-500 text-center">{`${contactType} introuvable.`}</p>
    );

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(contact.id, {
      onSuccess: () =>
        navigate(contactType === "employee" ? "/salariés" : `/${contactType}`),
    });
    setIsConfirmOpen(false);
  };

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const filteredSections = sections.map((section) => ({
    ...section,
    fields: section.fields.filter(
      (field) => !(roleId >= 3 && field.name.includes("Salary"))
    ),
  }));

  return (
    <div className="border p-4 w-full bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Informations générales</h2>
        <div className="flex space-x-2">
          <IconButton
            onClick={handleDelete}
            variant="red"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Suppression..." : <Trash2 />}
          </IconButton>
          <IconButton
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "gray" : "blue"}
          >
            {isEditing ? <X /> : <Pencil />}
          </IconButton>
        </div>
      </div>
      {isEditing ? (
        <EditContactForm
          contact={contact}
          sections={filteredSections}
          onSave={() => setIsEditing(false)}
          onUpdate={updateMutation.mutate}
          isUpdating={updateMutation.isLoading}
        />
      ) : (
        filteredSections.map(({ title, fields }, index) => (
          <ContactSection
            key={title}
            title={title}
            contact={contact}
            fields={fields}
            isOpen={openSections[index]}
            onToggle={() => toggleSection(index)}
          />
        ))
      )}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmer la suppression"
        message="Voulez-vous vraiment supprimer cet employé ?"
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
