import { useState } from "react";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function NewContactForm({ onSave, contactType, addMutation }) {
  const fields = CONTACT_FIELDS[contactType] || [];

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
        Ajouter un {contactType === "employee" ? "salarié" : "contact"}
      </h1>

      {fields.map(({ name, label, type, options, required }) => (
        <label key={name} className="block">
          <span className="text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </span>
          {type === "select" ? (
            <select
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
            >
              <option value="">Sélectionner...</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : type === "checkbox" ? (
            <input
              type="checkbox"
              name={name}
              checked={formData[name]}
              onChange={handleChange}
              className="mt-1"
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
              {...(type === "number" ? { min: 0 } : {})}
            />
          )}
        </label>
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
