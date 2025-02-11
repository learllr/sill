import { useState } from "react";
import { PROJECT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import Combobox from "../../Design/Buttons/Combobox.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function EditProjectForm({
  project,
  onSave,
  onUpdate,
  isUpdating,
}) {
  const [formFields, setFormFields] = useState({
    name: project?.name || "",
    status: project?.status || "Non commencé",
    clientId: project?.clientId || null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    if (!formFields.name) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    onUpdate(formFields);
    onSave();
  };

  return (
    <div className="space-y-3">
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

      <h2 className="text-lg font-semibold">Marché</h2>

      <label className="block">
        <span className="text-gray-700">Client</span>
        <Combobox
          subjects={project?.clients || []}
          onSelect={(value) =>
            setFormFields((prev) => ({ ...prev, clientId: value }))
          }
          placeholder="Sélectionnez un client..."
          defaultValue={formFields.clientId}
        />
      </label>

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
