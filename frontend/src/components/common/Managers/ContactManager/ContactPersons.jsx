import { formatPhoneNumber } from "../../../../../../shared/utils/formatUtils";

export default function ContactPersons({ contactPersons }) {
  if (!contactPersons || contactPersons.length === 0) {
    return <p>Aucun interlocuteur</p>;
  }

  return (
    <div className="space-y-4">
      {contactPersons.map((person, index) => (
        <div key={index} className="space-y-1 text-sm text-gray-900">
          <p>
            <strong>Nom :</strong> {person.name || "Non renseigné"}
          </p>
          <p>
            <strong>Téléphone :</strong>{" "}
            {person.phone ? (
              <a
                href={`tel:${person.phone}`}
                className="text-blue-600 underline"
              >
                {formatPhoneNumber(person.phone)}
              </a>
            ) : (
              "Non renseigné"
            )}
          </p>
          <p>
            <strong>Email :</strong>{" "}
            {person.email ? (
              <a
                href={`mailto:${person.email}`}
                className="text-blue-600 underline"
              >
                {person.email}
              </a>
            ) : (
              "Non renseigné"
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
