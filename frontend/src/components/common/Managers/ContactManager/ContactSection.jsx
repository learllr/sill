import { ChevronDown, ChevronUp } from "lucide-react";
import {
  formatDate,
  formatPhoneNumber,
  formatPostalCode,
  formatSalary,
  formatSocialSecurityNumber,
} from "../../../../../../shared/utils/formatUtils";
import ContactPersons from "./ContactPersons.jsx";

export default function ContactSection({
  title,
  fields,
  contact,
  isOpen,
  onToggle,
}) {
  const formattedFields = fields.reduce((acc, { name, label, key }) => {
    if (name === "contactPersons") {
      if (!acc[name]) acc[name] = { label, values: [] };
      acc[name].values.push({ key, label });
    } else {
      acc[name] = { label, value: contact[name] ?? "Non renseigné" };
    }
    return acc;
  }, {});

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
        <div className="space-y-1">
          {Object.entries(formattedFields).map(
            ([key, { label, value, values }]) => {
              if (values) {
                return contact[key]?.length > 0 ? (
                  <div key={key} className="text-sm text-gray-900">
                    <ContactPersons contactPersons={contact[key]} />
                  </div>
                ) : (
                  <p key={key} className="text-sm text-gray-500">
                    Aucun interlocuteur
                  </p>
                );
              }

              if (typeof value === "boolean") {
                value = value ? "Oui" : "Non";
              }

              if (key.includes("Date") && value !== "Non renseigné") {
                value = formatDate(value);
              }

              if (key.includes("phone") && value !== "Non renseigné") {
                value = (
                  <a href={`tel:${value}`} className="text-blue-600 underline">
                    {formatPhoneNumber(value)}
                  </a>
                );
              }

              if (key.includes("email") && value !== "Non renseigné") {
                value = (
                  <a
                    href={`https://mail.orange.fr/appsuite/#!!&app=io.ox/mail&folder=default0/INBOX&to=${encodeURIComponent(
                      value
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {value}
                  </a>
                );
              }

              if (key.includes("Salary") && value !== "Non renseigné") {
                value = formatSalary(value);
              }

              if (key.includes("Secu") && value !== "Non renseigné") {
                value = formatSocialSecurityNumber(value);
              }

              if (key.includes("postal") && value !== "Non renseigné") {
                value = formatPostalCode(value);
              }

              if (key.includes("website") && value !== "Non renseigné") {
                value = (
                  <a
                    href={value.startsWith("http") ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {value}
                  </a>
                );
              }

              return (
                <p key={key} className="text-sm text-gray-900">
                  <strong>{label} :</strong> {value}
                </p>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
