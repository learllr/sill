import { useState } from "react";
import { PROJECT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function NewProjectForm({ onSave, addMutation }) {
  const [formFields, setFormFields] = useState({
    name: "",
    status: "Non commencé",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = () => {
    const newErrors = {};
    PROJECT_FIELDS.forEach((field) => {
      if (field.required && !formFields[field.name]) {
        newErrors[field.name] = "Ce champ est obligatoire.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addMutation.mutate(formFields, {
      onSuccess: onSave,
      onError: () => setErrors({ name: "Erreur lors de l'ajout du projet." }),
    });
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        Ajouter un projet
      </h1>

      {PROJECT_FIELDS.map((field) => (
        <div key={field.name} className="mb-3">
          <label className="block">
            <span className="text-gray-700">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </span>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formFields[field.name]}
                onChange={handleChange}
                className={`block w-full mt-1 border rounded-md p-2 ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formFields[field.name]}
                onChange={handleChange}
                className={`block w-full mt-1 border rounded-md p-2 ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
              />
            )}
          </label>
          {errors[field.name] && (
            <p className="text-red-500 text-sm">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <IconButton onClick={handleSubmit} variant="green" className="w-full">
        Modifier
      </IconButton>
    </div>
  );
}
