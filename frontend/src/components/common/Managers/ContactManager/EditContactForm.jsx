import { useState } from "react";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields";
import {
  formatPhoneNumber,
  formatPostalCode,
  formatSalary,
  formatSocialSecurityNumber,
  isDate,
} from "../../../../../../shared/utils/formatUtils";
import IconButton from "../../Design/Buttons/IconButton";
import EditContactSection from "./EditContactSection";

export default function EditContactForm({
  contact,
  onSave,
  contactType,
  onUpdate,
  isUpdating,
}) {
  const isEmployee = contactType === "employee";
  const fieldsData =
    CONTACT_FIELDS[
      isEmployee ? contactType : getTypeName(contactType, "english")
    ] || [];
  const fields = Array.isArray(fieldsData)
    ? fieldsData
    : fieldsData.flatMap((section) => section.fields);

  const initialFormData = fields.reduce((acc, field) => {
    let value =
      contact[field.name] ??
      (field.type === "checkbox" ? field.defaultValue || false : "");
    if (field.type === "date" && isDate(value))
      value = new Date(value).toISOString().split("T")[0];
    acc[field.name] = value;
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState([true, false, false]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let formattedValue = value;

    if (name.includes("phone")) formattedValue = formatPhoneNumber(value);
    if (name.includes("postal")) formattedValue = formatPostalCode(value);
    if (name.includes("Secu"))
      formattedValue = formatSocialSecurityNumber(value);
    if (name.includes("salary")) formattedValue = formatSalary(value);

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : formattedValue,
    }));
  };

  const handleSubmit = () => {
    const missingFields = fields
      .filter((field) => field.required && !formData[field.name])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      setError(
        `Veuillez remplir les champs obligatoires : ${missingFields.join(", ")}`
      );
      return;
    }

    onUpdate(
      { contactId: contact.id, formData },
      {
        onSuccess: onSave,
        onError: () => setError("Erreur lors de la modification du contact."),
      }
    );
  };

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

  const sections = [
    {
      title: "Informations personnelles",
      fields: fields.filter(({ name }) =>
        [
          "active",
          "firstName",
          "lastName",
          "birthDate",
          "birthCity",
          "nationality",
          "gender",
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

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {sections.map(({ title, fields }, index) => (
        <EditContactSection
          key={title}
          title={title}
          formData={formData}
          handleChange={handleChange}
          fields={fields}
          isOpen={openSections[index]}
          onToggle={() => toggleSection(index)}
        />
      ))}

      <IconButton
        onClick={handleSubmit}
        className="w-full"
        variant="blue"
        disabled={isUpdating}
      >
        {isUpdating ? "Modification en cours..." : "Modifier"}
      </IconButton>
    </div>
  );
}
