import { ChevronDown, ChevronUp } from "lucide-react";
import {
  formatDate,
  formatPhoneNumber,
  formatPostalCode,
  formatSalary,
  formatSocialSecurityNumber,
  isDate,
} from "../../../../../../shared/utils/formatUtils";

export default function ContactSection({
  title,
  fields,
  contact,
  isOpen,
  onToggle,
}) {
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
          {fields.map(({ name, label }) => {
            let value = contact[name] || "Non renseigné";

            if (value !== "Non renseigné") {
              if (typeof value === "boolean") value = value ? "Oui" : "Non";
              if (name.includes("Date") && isDate(value))
                value = formatDate(value);
              if (name.includes("phone")) value = formatPhoneNumber(value);
              if (name.includes("postal")) value = formatPostalCode(value);
              if (name.includes("Salary")) value = formatSalary(value);
              if (name.includes("Secu"))
                value = formatSocialSecurityNumber(value);
            }

            return (
              <p
                key={name}
                className={`text-sm ${
                  value === "Non renseigné" ? "text-gray-500" : "text-gray-900"
                }`}
              >
                <strong>{label} :</strong> {value}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}
