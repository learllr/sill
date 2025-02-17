import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import { getTypeName } from "../../../../../../shared/constants/types.js";
import { useContacts } from "../../../../hooks/useContacts.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import Loading from "../../Design/Loading.jsx";
import ContactSection from "./ContactSection.jsx";
import EditContactForm from "./EditContactForm.jsx";

export default function ContactInfo({ contactId, contactType }) {
  const navigate = useNavigate();
  const isEmployee = contactType === "employee";
  const { contacts, isLoading, isError, updateMutation, deleteMutation } =
    useContacts(
      isEmployee ? contactType : getTypeName(contactType, "singular")
    );
  const contact = contacts?.find((c) => c.id === parseInt(contactId));

  const fieldsData =
    CONTACT_FIELDS[
      isEmployee ? contactType : getTypeName(contactType, "english")
    ] || [];
  const fields = Array.isArray(fieldsData)
    ? fieldsData
    : fieldsData.flatMap((section) => section.fields);

  const sections = [
    {
      title: "Informations personnelles",
      fields: fields.filter(({ name }) =>
        [
          "active",
          "gender",
          "firstName",
          "lastName",
          "birthDate",
          "birthCity",
          "nationality",
          "familyStatus",
          "dependentChildren",
        ].includes(name)
      ),
    },
    {
      title: "Coordonnées",
      fields: fields.filter(({ name }) =>
        [
          "address",
          "postalCode",
          "city",
          "phone",
          "email",
          "jobTitle",
          "qualification",
        ].includes(name)
      ),
    },
    {
      title: "Contrat et salaire",
      fields: fields.filter(({ name }) =>
        [
          "contractType",
          "contractDurationMonths",
          "workTime",
          "monthlyNetSalary",
          "weeklyHours",
          "startDate",
          "endDate",
          "medicalCheckupDate",
          "socialSecurityNumber",
          "btpCard",
        ].includes(name)
      ),
    },
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [openSections, setOpenSections] = useState(
    sections.map((_, index) => index === 0)
  );

  if (isLoading) return <Loading />;
  if (isError || !contact)
    return (
      <p className="text-red-500 text-center">{`${contactType} introuvable.`}</p>
    );

  const getRedirectPath = () =>
    contactType === "employee"
      ? "/salariés"
      : `/${getTypeName(contactType, "plural")}`;

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce contact ?")) {
      deleteMutation.mutate(contact.id, {
        onSuccess: () => navigate(getRedirectPath()),
      });
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

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
          onSave={() => setIsEditing(false)}
          contactType={contactType}
          onUpdate={updateMutation.mutate}
          isUpdating={updateMutation.isLoading}
        />
      ) : (
        <>
          {sections.map(({ title, fields }, index) => (
            <ContactSection
              key={title}
              title={title}
              contact={contact}
              fields={fields}
              isOpen={openSections[index]}
              onToggle={() => toggleSection(index)}
            />
          ))}
        </>
      )}
    </div>
  );
}
