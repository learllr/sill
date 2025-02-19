import { useState } from "react";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import { getTypeName } from "../../../../../../shared/constants/types.js";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import FormField from "./FormField.jsx";

export default function NewContactForm({ onSave, contactType, addMutation }) {
  const isEmployee = contactType === "employee";
  const fields =
    CONTACT_FIELDS[
      isEmployee ? contactType : `${getTypeName(contactType, "english")}`
    ] || [];
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] =
      field.type === "checkbox"
        ? field.defaultValue ?? false
        : field.defaultValue ?? "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    addMutation.mutate(formData, {
      onSuccess: onSave,
      onError: () => setError("Erreur lors de l'ajout du contact."),
    });
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        Ajouter un{" "}
        {contactType === "employee" ? "salarié" : contactType.toLowerCase()}
      </h1>

      {fields.map(({ name, label, type, options, required }) => (
        <FormField
          key={name}
          name={name}
          label={label}
          type={type}
          options={options}
          required={required}
          value={formData[name]}
          onChange={handleChange}
        />
      ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <IconButton
        onClick={handleSubmit}
        className="w-full"
        variant="green"
        disabled={addMutation.isLoading}
      >
        {addMutation.isLoading ? "Ajout en cours..." : "Ajouter"}
      </IconButton>
    </div>
  );
}
