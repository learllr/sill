import { useState } from "react";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function EditContactForm({
  contact,
  onSave,
  contactType,
  onUpdate,
  isUpdating,
}) {
  const fieldsData = CONTACT_FIELDS[contactType] || [];

  const fields = Array.isArray(fieldsData)
    ? fieldsData
    : fieldsData.flatMap((section) => section.fields);

  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] =
      contact[field.name] !== undefined && contact[field.name] !== null
        ? contact[field.name]
        : field.type === "checkbox"
        ? field.defaultValue || false
        : "";
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
      .filter((field) => field.required && formData[field.name] === "")
      .map((field) => field.label);

    if (missingFields.length > 0) {
      setError(
        `Veuillez remplir les champs obligatoires : ${missingFields.join(", ")}`
      );
      return;
    }

    onUpdate(contact.id, formData, {
      onSuccess: onSave,
      onError: () => setError("Erreur lors de la modification du contact."),
    });
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        Modifier {contactType === "employee" ? "le salarié" : "le contact"}
      </h1>

      {Array.isArray(fieldsData)
        ? fields.map(({ name, label, type, options, required }) => (
            <label key={name} className="block">
              <span className="text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </span>
              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name] || ""}
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
                  checked={formData[name] || false}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ""}
                  onChange={handleChange}
                  className="block w-full mt-1 border rounded-md p-2"
                  {...(type === "number" ? { min: 0 } : {})}
                />
              )}
            </label>
          ))
        : fieldsData.map(({ section, fields }) => (
            <div key={section} className="mb-4">
              <h3 className="text-lg font-semibold mb-2">{section}</h3>
              {fields.map(({ name, label, type, options, required }) => (
                <label key={name} className="block">
                  <span className="text-gray-700">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </span>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={formData[name] || ""}
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
                      checked={formData[name] || false}
                      onChange={handleChange}
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name] || ""}
                      onChange={handleChange}
                      className="block w-full mt-1 border rounded-md p-2"
                      {...(type === "number" ? { min: 0 } : {})}
                    />
                  )}
                </label>
              ))}
            </div>
          ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}

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
