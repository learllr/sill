import { useState } from "react";
import {
  formatPhoneNumber,
  formatPostalCode,
  formatSalary,
  formatSocialSecurityNumber,
  isDate,
} from "../../../../../../shared/utils/formatUtils";
import { useMessageDialog } from "../../../contexts/MessageDialogContext";
import ActionButton from "../../Design/Buttons/ActionButton";
import EditContactSection from "./EditContactSection";

export default function EditContactForm({
  contact,
  onSave,
  onUpdate,
  isUpdating,
  sections,
  contactType,
}) {
  const [openSections, setOpenSections] = useState(
    sections.map((_, index) => index === 0)
  );
  const { showMessage } = useMessageDialog();

  const [formData, setFormData] = useState(
    sections.reduce((acc, { fields }) => {
      fields.forEach(({ name, type, defaultValue }) => {
        let value =
          contact[name] ?? (type === "checkbox" ? defaultValue || false : "");
        if (type === "date" && isDate(value))
          value = new Date(value).toISOString().split("T")[0];
        acc[name] = value;
      });
      return acc;
    }, {})
  );

  const [error, setError] = useState("");

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, i) => (i === index ? !isOpen : isOpen))
    );
  };

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
    const missingFields = sections
      .flatMap(({ fields }) =>
        fields.filter((field) => field.required && !formData[field.name])
      )
      .map((field) => field.label);

    if (missingFields.length > 0) {
      setError(
        `Veuillez remplir les champs obligatoires : ${missingFields.join(", ")}`
      );
      return;
    }

    if (formData.contactPersons) {
      formData.contactPersons = formData.contactPersons.filter((contact) =>
        Object.values(contact).some(
          (val) => typeof val === "string" && val.trim() !== ""
        )
      );
    }

    onUpdate(
      { contactId: contact.id, formData },
      {
        onSuccess: () => {
          showMessage("success", `${contactType} mis à jour avec succès.`);
          onSave();
        },
        onError: () => {
          showMessage(
            "error",
            `Erreur lors de la mise à jour du ${contactType.toLowerCase()}.`
          );
        },
      }
    );
  };

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {sections.map(({ title, fields }, index) => (
        <EditContactSection
          key={title}
          title={title}
          fields={fields}
          formData={formData}
          handleChange={handleChange}
          isOpen={openSections[index]}
          onToggle={() => toggleSection(index)}
          setFormData={setFormData}
        />
      ))}

      <ActionButton
        onClick={handleSubmit}
        className="w-full"
        variant="blue"
        disabled={isUpdating}
      >
        {isUpdating ? "Modification en cours..." : "Modifier"}
      </ActionButton>
    </div>
  );
}
