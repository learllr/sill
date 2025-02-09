import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import IconButton from "../../Design/Buttons/IconButton.jsx";

export default function FormField({
  name,
  label,
  type,
  options,
  required,
  value,
  onChange,
}) {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (type === "contactPersons" && (!value || value.length === 0)) {
      setContacts([{ name: "", phone: "", email: "" }]);
      onChange({
        target: { name, value: [{ name: "", phone: "", email: "" }] },
      });
    } else {
      setContacts(value || []);
    }
  }, [value, type]);

  const handleContactChange = (index, field, val) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = val;
    setContacts(updatedContacts);
    onChange({ target: { name, value: updatedContacts } });
  };

  const addContact = () => {
    const updatedContacts = [...contacts, { name: "", phone: "", email: "" }];
    setContacts(updatedContacts);
    onChange({ target: { name, value: updatedContacts } });
  };

  const removeContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
    onChange({ target: { name, value: updatedContacts } });
  };

  return (
    <div className="block space-y-2">
      <span className="text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
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
          checked={value}
          onChange={onChange}
          className="mt-1"
        />
      ) : type === "contactPersons" ? (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className="border p-4 rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Interlocuteur {index + 1}</span>
                {contacts.length > 1 && (
                  <IconButton
                    onClick={() => removeContact(index)}
                    variant="red"
                  >
                    <Trash size={16} />
                  </IconButton>
                )}
              </div>
              <div>
                <label className="block text-gray-700">Nom</label>
                <input
                  type="text"
                  placeholder="Nom"
                  value={contact.name}
                  onChange={(e) =>
                    handleContactChange(index, "name", e.target.value)
                  }
                  className="block w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Téléphone</label>
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={contact.phone}
                  onChange={(e) =>
                    handleContactChange(index, "phone", e.target.value)
                  }
                  className="block w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={contact.email}
                  onChange={(e) =>
                    handleContactChange(index, "email", e.target.value)
                  }
                  className="block w-full border p-2 rounded-md"
                />
              </div>
            </div>
          ))}
          <IconButton onClick={addContact} variant="blue" className="w-full">
            <Plus size={16} /> Ajouter un interlocuteur
          </IconButton>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full mt-1 border rounded-md p-2"
          {...(type === "number" ? { min: 0 } : {})}
        />
      )}
    </div>
  );
}
