import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import { getTypeName } from "../../../../../../shared/constants/types.js";
import IconButton from "../../Design/Buttons/IconButton.jsx";

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

  const handleArrayChange = (fieldName, index, key, value) => {
    setFormData((prev) => {
      const updatedArray = [...(prev[fieldName] || [])];
      updatedArray[index] = { ...updatedArray[index], [key]: value };
      return { ...prev, [fieldName]: updatedArray };
    });
  };

  const handleAddArrayItem = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [
        ...(prev[fieldName] || []),
        { name: "", phone: "", email: "" },
      ],
    }));
  };

  const handleRemoveArrayItem = (fieldName, index) => {
    setFormData((prev) => {
      const updatedArray = prev[fieldName].filter((_, i) => i !== index);
      return { ...prev, [fieldName]: updatedArray };
    });
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

    const cleanedFormData = { ...formData };

    Object.keys(cleanedFormData).forEach((key) => {
      if (Array.isArray(cleanedFormData[key])) {
        cleanedFormData[key] = cleanedFormData[key].filter(
          (item) =>
            item.name.trim() !== "" ||
            item.phone.trim() !== "" ||
            item.email.trim() !== ""
        );
      }
    });

    onUpdate(
      { contactId: contact.id, formData: cleanedFormData },
      {
        onSuccess: onSave,
        onError: () => setError("Erreur lors de la modification du contact."),
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map(({ name, label, type, options, required }) => {
          const value = formData[name];

          if (Array.isArray(value)) {
            return (
              <div key={name} className="col-span-full">
                <strong>{label}</strong>
                <div className="space-y-2 mt-2">
                  {value.map((item, index) => (
                    <div key={index} className="flex space-x-2 items-center">
                      <input
                        type="text"
                        placeholder="Nom"
                        value={item.name || ""}
                        onChange={(e) =>
                          handleArrayChange(name, index, "name", e.target.value)
                        }
                        className="border rounded-md p-2 flex-1"
                      />
                      <input
                        type="text"
                        placeholder="Téléphone"
                        value={item.phone || ""}
                        onChange={(e) =>
                          handleArrayChange(
                            name,
                            index,
                            "phone",
                            e.target.value
                          )
                        }
                        className="border rounded-md p-2 flex-1"
                      />
                      <input
                        type="text"
                        placeholder="Email"
                        value={item.email || ""}
                        onChange={(e) =>
                          handleArrayChange(
                            name,
                            index,
                            "email",
                            e.target.value
                          )
                        }
                        className="border rounded-md p-2 flex-1"
                      />
                      <IconButton
                        onClick={() => handleRemoveArrayItem(name, index)}
                        variant="red"
                      >
                        <Trash2 />
                      </IconButton>
                    </div>
                  ))}
                  <IconButton
                    onClick={() => handleAddArrayItem(name)}
                    variant="green"
                  >
                    <Plus />
                  </IconButton>
                </div>
              </div>
            );
          }

          return (
            <label key={name} className="block">
              <span className="text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
              </span>
              {type === "select" ? (
                <select
                  name={name}
                  value={value || ""}
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
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="checkbox"
                    name={name}
                    checked={value || false}
                    onChange={handleChange}
                  />
                  <span>{label}</span>
                </div>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={value || ""}
                  onChange={handleChange}
                  className="block w-full mt-1 border rounded-md p-2"
                  {...(type === "number" ? { min: 0 } : {})}
                />
              )}
            </label>
          );
        })}
      </div>

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
