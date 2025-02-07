import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields.js";

export default function ContactDetails({ contact, contactType }) {
  const fields = CONTACT_FIELDS[contactType] || [];

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
    } catch {
      return null;
    }
  };

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-lg text-center font-semibold">Détails du contact</h2>
      <div className="flex flex-col space-y-1">
        {fields.length > 0 ? (
          fields.map(({ name, label, type }) => {
            let value = contact?.[name];

            if (value === null || value === "" || value === "0.00") return null;
            if (type === "checkbox") value = value ? "Oui" : "Non";
            if (type === "date") value = formatDate(value);

            return value ? (
              <p key={name}>
                <strong>{label} :</strong> {value}
              </p>
            ) : null;
          })
        ) : (
          <p className="text-center text-gray-500">
            Aucun détail disponible pour ce type de contact.
          </p>
        )}
      </div>
    </div>
  );
}
