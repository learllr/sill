import { Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CONTACT_FIELDS } from "../../../../../../shared/constants/contactFields.js";
import { getTypeName } from "../../../../../../shared/constants/types.js";
import { useContacts } from "../../../../hooks/useContacts.jsx";
import IconButton from "../../Design/Buttons/IconButton.jsx";
import Loading from "../../Design/Loading.jsx";
import EditContactForm from "./EditContactForm.jsx";
import {
  formatPhoneNumber,
  formatUrl,
  formatDate,
  isDate,
  formatPostalCode,
  formatSocialSecurityNumber,
  formatSalary,
} from "../../../../../../shared/utils/formatUtils.js";

export default function ContactInfo({ contactId, contactType }) {
  const navigate = useNavigate();
  const isEmployee = contactType === "employee";
  const { contacts, isLoading, isError, updateMutation, deleteMutation } =
    useContacts(
      isEmployee ? contactType : getTypeName(contactType, "singular")
    );
  const contact = contacts?.find((c) => c.id === parseInt(contactId));

  const fields =
    CONTACT_FIELDS[
      isEmployee ? contactType : getTypeName(contactType, "english")
    ] || [];

  const [isEditing, setIsEditing] = useState(false);
  if (isLoading) return <Loading />;
  if (isError || !contact)
    return (
      <p className="text-red-500 text-center">{`${contactType} introuvable.`}</p>
    );

  const getRedirectPath = () => {
    return contactType === "employee"
      ? "/salariés"
      : `/${getTypeName(contactType, "plural")}`;
  };

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer ce contact ?")) {
      deleteMutation.mutate(contact.id, {
        onSuccess: () => navigate(getRedirectPath()),
      });
    }
  };

  return (
    <div className="border p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Informations générales</h2>
        <div className="flex space-x-2">
          <IconButton
            onClick={handleDelete}
            variant="red"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Suppression..." : <Trash2 />}
          </IconButton>
          {!isEditing ? (
            <IconButton onClick={() => setIsEditing(true)} variant="blue">
              <Pencil />
            </IconButton>
          ) : (
            <IconButton onClick={() => setIsEditing(false)} variant="gray">
              <X />
            </IconButton>
          )}
        </div>
      </div>

      {isEditing ? (
        <EditContactForm
          contact={contact}
          onSave={() => setIsEditing(false)}
          contactType={contactType}
          onUpdate={updateMutation.mutate}
          isUpdating={updateMutation.isLoading}
        />
      ) : (
        <>
          {fields.map(({ name, label, type, options }) => {
            let value = contact[name];

            if (!value || value === "0.00") return null;
            if (type === "checkbox") value = value ? "Oui" : "Non";
            if (type === "select" && options)
              value = options.includes(value) ? value : "Non défini";
            if (Array.isArray(value)) {
              const filteredContacts = value.filter(
                (item) => item.name || item.phone || item.email
              );

              if (filteredContacts.length === 0) return null;

              return (
                <div key={name}>
                  <strong>
                    {label}
                    {filteredContacts.length > 1 ? "s" : ""} :
                  </strong>
                  <ul className="list-disc list-inside">
                    {filteredContacts.map((item, index) => (
                      <li key={index} className="ml-5">
                        {item.name && (
                          <span>
                            <strong>Nom :</strong> {item.name}{" "}
                          </span>
                        )}
                        {item.phone && (
                          <span>
                            - <strong>Téléphone :</strong>{" "}
                            <a
                              href={`tel:${item.phone.replace(/\s/g, "")}`}
                              className="text-blue-500 underline"
                            >
                              {formatPhoneNumber(item.phone)}
                            </a>
                          </span>
                        )}
                        {item.email && (
                          <span>
                            - <strong>Email :</strong>{" "}
                            <a
                              href={`https://mail.orange.fr/appsuite/#!!&app=io.ox/mail&folder=default0/INBOX&to=${item.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {item.email}
                            </a>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }

            if (name.toLowerCase().includes("date") && isDate(value)) {
              value = formatDate(value);
            }

            if (name.toLowerCase().includes("phone")) {
              value = formatPhoneNumber(value);
              return (
                <p key={name}>
                  <strong>{label} :</strong>{" "}
                  <a
                    href={`tel:${value.replace(/\s/g, "")}`}
                    className="text-blue-500 underline"
                  >
                    {value}
                  </a>
                </p>
              );
            }

            if (name.toLowerCase().includes("postal")) {
              value = formatPostalCode(value);
            }

            if (name.toLowerCase().includes("secu")) {
              value = formatSocialSecurityNumber(value);
            }

            if (name.toLowerCase().includes("salary")) {
              value = formatSalary(value);
            }

            if (
              name.toLowerCase().includes("website") ||
              name.toLowerCase().includes("site")
            ) {
              return (
                <p key={name}>
                  <strong>{label} :</strong>{" "}
                  <a
                    href={formatUrl(value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {value}
                  </a>
                </p>
              );
            }

            return (
              <p key={name}>
                <strong>{label} :</strong> {value}
              </p>
            );
          })}
        </>
      )}
    </div>
  );
}
