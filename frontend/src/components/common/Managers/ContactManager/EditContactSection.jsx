import { ChevronDown, ChevronUp } from "lucide-react";
import EditContactPersons from "./EditContactPersons";

export default function EditContactSection({
  title,
  fields,
  formData,
  handleChange,
  setFormData,
  isOpen,
  onToggle,
}) {
  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 border border-gray-200 rounded-lg bg-white">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition rounded-lg"
      >
        <h3 className="text-md font-semibold">{title}</h3>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[500px] opacity-100 py-4 px-4"
            : "max-h-0 opacity-0 px-4"
        }`}
      >
        {title === "Interlocuteurs" ? (
          <EditContactPersons
            contactPersons={formData.contactPersons || []}
            formData={formData}
            setFormData={setFormData}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {fields.map(({ name, label, type, options, required }) => {
              let value = formData[name] || "";
              let placeholder = "";
              if (name === "postalCode") placeholder = "XX XXX";
              if (name === "phone") placeholder = "XX XX XX XX XX";
              if (name === "socialSecurityNumber")
                placeholder = "X XX XX XX XXX XXX XX";

              return (
                <label key={name} className="block">
                  <span className="text-gray-700">
                    {label}{" "}
                    {required && <span className="text-red-500">*</span>}
                  </span>
                  {type === "checkbox" ? (
                    <div className="flex items-center mt-2 space-x-2">
                      <input
                        type="checkbox"
                        name={name}
                        checked={!!formData[name]}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <span>{formData[name] ? "Oui" : "Non"}</span>
                    </div>
                  ) : type === "select" ? (
                    <select
                      name={name}
                      value={value}
                      onChange={handleChange}
                      className="block w-full mt-1 border rounded-md p-2"
                    >
                      <option value="">Sélectionnez...</option>
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={value}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="block w-full mt-1 border rounded-md p-2"
                    />
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
