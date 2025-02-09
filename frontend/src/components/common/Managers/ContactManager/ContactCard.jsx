import { User } from "lucide-react";

export default function ContactCard({ contact, contactType, onSelectItem }) {
  const isEmployee = contactType === "employee";
  const userColor = isEmployee
    ? contact.gender === "Femme"
      ? "text-pink-500"
      : "text-blue-500"
    : "text-gray-500";

  const borderColor = isEmployee
    ? contact.active
      ? "border-green-500"
      : "border-red-500"
    : "border-gray-300";

  return (
    <div
      className={`flex items-center justify-between p-3 border ${borderColor} rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-all`}
      onClick={() => onSelectItem(contact)}
    >
      <div className="flex items-center space-x-3">
        <User className={userColor} />
        <div>
          {isEmployee ? (
            <p className="text-md text-gray-800">
              {contact.firstName} {contact.lastName?.toUpperCase()}
            </p>
          ) : (
            <p className="text-md text-gray-800">{contact.name}</p>
          )}
        </div>
      </div>
    </div>
  );
}
