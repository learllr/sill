import {
  precisionArchitectMenuItems,
  precisionClientMenuItems,
  precisionSubcontractorMenuItems,
  precisionSupplierMenuItems,
} from "./menuItems.js";

export const ParticipantType = {
  CLIENT: "Client",
  FOURNISSEUR: "Fournisseur",
  SOUS_TRAITANT: "Sous-traitant",
  ARCHITECTE: "Architecte",
};

export const DocumentType = {
  // Banque
  RELEVES_DE_COMPTES: "Relevés de comptes",
  DOCUMENTS_BANCAIRES: "Documents bancaires",

  // Statuts
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
  [ParticipantType.CLIENT]: {
    singular: "client",
    plural: "clients",
    english: "client",
  },
  [ParticipantType.FOURNISSEUR]: {
    singular: "fournisseur",
    plural: "fournisseurs",
    english: "supplier",
  },
  [ParticipantType.SOUS_TRAITANT]: {
    singular: "sous-traitant",
    plural: "sous-traitants",
    english: "subcontractor",
  },
  [ParticipantType.ARCHITECTE]: {
    singular: "architecte",
    plural: "architectes",
    english: "architect",
  },
};

export const getTypeName = (typeId, type = "plural") => {
  return (
    typeMapping[typeId]?.[type] ||
    (type === "english" ? "Participants" : "participants")
  );
};

export const getPrecisionContactMenuItems = (participantType) => {
  switch (participantType) {
    case ParticipantType.CLIENT:
      return precisionClientMenuItems;
    case ParticipantType.FOURNISSEUR:
      return precisionSupplierMenuItems;
    case ParticipantType.SOUS_TRAITANT:
      return precisionSubcontractorMenuItems;
    case ParticipantType.ARCHITECTE:
      return precisionArchitectMenuItems;
    default:
      return [];
  }
};
