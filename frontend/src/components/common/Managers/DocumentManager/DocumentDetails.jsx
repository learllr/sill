import { EMPLOYEE_FIELDS } from "../../../../../../shared/constants/contactFields.js";
// import { SUPPLIER_FIELDS } from "../../../../../../shared/constants/contactFields.js"; // Ajoute d'autres types ici si nécessaire

const CONTACT_FIELDS = {
  employee: EMPLOYEE_FIELDS,
  // supplier: SUPPLIER_FIELDS,
};

export default function ContactDetails({ contact, contactType }) {
  const fields = CONTACT_FIELDS[contactType] || [];

  return (
    <div className="p-2 space-y-4">
      <h2 className="text-lg text-center font-semibold">Détails du contact</h2>
      <div className="flex flex-col space-y-1">
        {fields.length > 0 ? (
          fields.map(({ name, label }) => (
            <p key={name}>
              <strong>{label} :</strong> {contact?.[name] || "Non renseigné"}
            </p>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Aucun détail disponible pour ce type de contact.
          </p>
        )}
      </div>
    </div>
  );
}
