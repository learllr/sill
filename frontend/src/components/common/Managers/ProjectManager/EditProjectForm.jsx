import { useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import { PROJECT_FIELDS } from "../../../../../../shared/constants/contactFields.js";

export default function EditProjectForm({
  project,
  onSave,
  onUpdate,
  isUpdating,
}) {
  const [formFields, setFormFields] = useState({
    name: project?.name || "",
    status: project?.status || "Non commencé",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formFields.name) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    onUpdate(project.id, formFields);
    onSave();
  };

  return (
    <div className="p-2 space-y-3">
      <h1 className="text-lg font-semibold text-center mb-5">
        Modifier le projet
      </h1>

      {PROJECT_FIELDS.map((field) => (
        <label key={field.name} className="block">
          <span className="text-gray-700">{field.label}</span>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={formFields[field.name]}
              onChange={handleChange}
              className="block w-full mt-1 border rounded-md p-2"
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
              className="block w-full mt-1 border rounded-md p-2"
            />
          )}
        </label>
      ))}

      <IconButton
        onClick={handleSubmit}
        disabled={isUpdating}
        variant="blue"
        className="w-full"
      >
        {isUpdating ? "Modification en cours..." : "Modifier"}
      </IconButton>
    </div>
  );
}
