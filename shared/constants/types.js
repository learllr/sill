export const ParticipantType = {
  CLIENT: "Client",
  FOURNISSEUR: "Fournisseur",
  SOUS_TRAITANT: "Sous-traitant",
  ARCHITECTE: "Architecte",
  SALARIE: "salarié",
};

export const DocumentType = {
  // Banque
  RELEVES_DE_COMPTES: "Relevés de comptes",
  DOCUMENTS_BANCAIRES: "Documents bancaires",

  // Statut SILL
  BILANS: "Bilans",
  STATUTS: "Statuts",

  // CEDIG
  CEDIG: "CEDIG",

  // Notes
  NOTES_DE_SERVICE: "Notes de services",

  // Employé
  PIECE_IDENTITE: "Pièce d'identité",
  PERMIS: "Permis",
  PHOTO_IDENTITE: "Photo d'identité",
  COUVERTURE_SANTE: "Couverture santé",
  DECLARATION_URSSAFF: "Déclaration URSSAFF",
  CONTRATS: "Contrats",
  BULLETINS_SALAIRES: "Bulletins de salaires",
  FRAIS: "Frais",
  COURRIERS: "Courriers",
  CONGES: "Congés",
  ACCIDENTS_TRAVAIL: "Accidents du travail",
  VISITES_MEDICALES: "Visites médicales",
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
