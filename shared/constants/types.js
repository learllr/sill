export const ParticipantType = {
  CLIENT: "Client",
  FOURNISSEUR: "Fournisseur",
  SOUS_TRAITANT: "Sous-traitant",
  ARCHITECTE: "Architecte",
  SALARIE: "salarié",
};

export const DocumentType = {
  RELEVES_DE_COMPTES: "Relevés de comptes",
  DOCUMENTS_BANCAIRES: "Documents bancaires",
  BILANS: "Bilans",
  STATUTS: "Statuts",
  CEDIG: "CEDIG",
  NOTES_DE_SERVICE: "Notes de services",
};

export const typeMapping = {
  [ParticipantType.CLIENT]: { singular: "client", plural: "clients" },
  [ParticipantType.FOURNISSEUR]: {
    singular: "fournisseur",
    plural: "fournisseurs",
  },
  [ParticipantType.SOUS_TRAITANT]: {
    singular: "sous-traitant",
    plural: "sous-traitants",
  },
  [ParticipantType.ARCHITECTE]: {
    singular: "architecte",
    plural: "architectes",
  },
  [ParticipantType.SALARIE]: { singular: "salarié", plural: "salariés" },
};

export const getTypeName = (typeId, isPlural = true) => {
  return typeMapping[typeId]
    ? isPlural
      ? typeMapping[typeId].plural
      : typeMapping[typeId].singular
    : isPlural
    ? "Participants"
    : "Participant";
};
