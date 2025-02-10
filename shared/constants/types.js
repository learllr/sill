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
  NOTES_DE_SERVICE: "Notes de service",

  // Employé
  PIECES_D_IDENTITE: "Pièce d'identité",
  PERMIS: "Permis",
  PHOTOS_D_IDENTITE: "Photo d'identité",
  COUVERTURES_SANTE: "Couverture santé",
  DECLARATIONS_URSSAF: "Déclaration URSSAF",
  CONTRATS: "Contrats",
  BULLETINS_DE_SALAIRE: "Bulletins de salaire",
  FRAIS: "Frais",
  COURRIERS: "Courriers",
  CONGES: "Congés",
  ACCIDENTS_DU_TRAVAIL: "Accidents du travail",
  VISITES_MEDICALES: "Visites médicales",

  // Participant (Client, Fournisseur, Sous-traitant, Architecte)
  FACTURES: "Factures",
  DEVIS: "Devis",
  DEVIS_VALIDES: "Devis validés",
  FICHES_TECHNIQUES: "Fiches techniques",
  BONS_POUR_ACCORD: "Bons pour accord",
  ADMINISTRATIFS: "Administratifs",
  PLANS: "Plans",
  BONS_DE_COMMANDE: "Bons de commande",
  PROCES_VERBAUX: "Procès-verbaux",
  ORDRES_DE_REGLEMENT: "Ordres de règlement",
  RESERVES: "Réserves",
  MARCHES: "Marchés",
  DOE: "DOE",
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
