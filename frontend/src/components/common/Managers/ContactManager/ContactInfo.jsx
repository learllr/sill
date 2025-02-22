import { Pencil, Trash2, Undo2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContacts } from "../../../../hooks/useContacts.jsx";
import { useMessageDialog } from "../../../contexts/MessageDialogContext.jsx";
import { useUser } from "../../../contexts/UserContext";
import ConfirmDialog from "../../../dialogs/ConfirmDialog";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import Loading from "../../Design/Loading.jsx";
import ContactSection from "./ContactSection.jsx";
import EditContactForm from "./EditContactForm.jsx";

export default function ContactInfo({
  sections,
  contactId,
  contactType,
  isTrash,
}) {
  const navigate = useNavigate();

  const { contacts, isLoading, isError, updateMutation, deleteMutation } =
    useContacts(contactType);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { roleId } = useUser();
  const { showMessage } = useMessageDialog();

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
    const contactTypeUrl =
      contactType === "employee"
        ? "/salariés"
        : `/${contactType.toLowerCase()}s`;
    const contactTypeText =
      contactType === "employee" ? "Salarié" : `${contactType}`;

    if (isTrash) {
      deleteMutation.mutate(contact.id, {
        onSuccess: () => {
          showMessage(
            "success",
            `${contactTypeText} a été supprimé définitivement avec succès.`
          );
          navigate("/corbeille");
        },
        onError: () => {
          showMessage(
            "error",
            `Erreur lors de la suppression du ${contactTypeText.toLowerCase()}.`
          );
        },
      });
    } else {
      updateMutation.mutate(
        { contactId: contact.id, formData: { deleted: true } },
        {
          onSuccess: () => {
            showMessage(
              "success",
              `${contactTypeText} déplacé vers la corbeille.`
            );
            navigate(contactTypeUrl);
          },
          onError: () => {
            showMessage(
              "error",
              `Erreur lors de la mise à jour du ${contactTypeText.toLowerCase()}.`
            );
          },
        }
      );
    }
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
    <div
      className={`p-4 w-full ${isTrash ? "border border-rose-300" : "border"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Informations générales</h2>
        <div className="flex space-x-2">
          {isTrash && (
            <IconButton
              onClick={() =>
                updateMutation.mutate(
                  { contactId: contact.id, formData: { deleted: false } },
                  {
                    onSuccess: () => {
                      showMessage(
                        "success",
                        `${
                          contactType === "employee" ? "Salarié" : contactType
                        } restauré avec succès.`
                      );
                      navigate(
                        contactType === "employee"
                          ? "/salariés"
                          : `/${contactType.toLowerCase()}s`
                      );
                    },
                    onError: () => {
                      showMessage(
                        "error",
                        `Erreur lors de la restauration du ${
                          contactType === "employee"
                            ? "Salarié"
                            : contactType.toLowerCase()
                        }.`
                      );
                    },
                  }
                )
              }
              variant="green"
              disabled={updateMutation.isLoading}
            >
              {updateMutation.isLoading ? "Restauration..." : <Undo2 />}
            </IconButton>
          )}
          <IconButton
            onClick={handleDelete}
            variant="red"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Suppression..." : <Trash2 />}
          </IconButton>
          {!isTrash && (
            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "gray" : "blue"}
            >
              {isEditing ? <X /> : <Pencil />}
            </IconButton>
          )}
        </div>
      </div>
      {isEditing ? (
        <EditContactForm
          contact={contact}
          sections={filteredSections}
          onSave={() => setIsEditing(false)}
          onUpdate={updateMutation.mutate}
          isUpdating={updateMutation.isLoading}
          contactType={
            contactType === "employee" ? "Salarié" : `${contactType}`
          }
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
        message={`Voulez-vous vraiment supprimer ${
          isTrash ? "définitivement" : ""
        } cet employé ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
