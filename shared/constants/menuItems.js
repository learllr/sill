export const bankMenuItems = [
  { label: "Relevés de comptes" },
  { label: "Documents bancaires" },
];

export const sillStatusMenuItems = [{ label: "Bilans" }, { label: "Statuts" }];

export const ziedMenuItems = [
  {
    label: "CEDIG",
    subMenu: ["Tous", "Fournisseurs", "Clients"],
  },
  {
    label: "Les envois",
  },
];

export const memoMenuItems = [{ label: "Notes de services" }];

export const employeeMenuItems = [
  {
    subMenu: ["Tous", "Actifs", "Inactifs"],
  },
];

export const precisionEmployeeMenuItems = [
  {
    label: "État civil",
    subMenu: [
      "Pièce d'identité",
      "Permis",
      "Photo d'identité",
      "Couverture santé",
    ],
  },
  {
    label: "Administratif",
    subMenu: [
      "Déclaration URSSAFF",
      "Contrats",
      "Bulletins de salaires",
      "Frais",
      "Courriers",
      "Congés",
      "Accidents du travail",
      "Visites médicales",
    ],
  },
];

export const precisionClientMenuItems = [
  {
    label: "Factures",
    subMenu: ["Tous", "Non payés", "Payés"],
  },
  {
    label: "Devis",
    subMenu: ["Tous", "En attente", "Acceptés", "Rejetés"],
  },
  {
    label: "Marchés",
  },
];

export const precisionSupplierMenuItems = [
  {
    label: "Factures",
    subMenu: ["Tous", "Non payés", "Payés"],
  },
  {
    label: "Devis",
  },
  {
    label: "Fiches techniques",
  },
  {
    label: "Bon pour accord",
  },
];

export const precisionSubcontractorMenuItems = [
  {
    label: "Factures",
    subMenu: ["Tous", "Non payés", "Payés"],
  },
  {
    label: "Contrats",
  },
  {
    label: "Administratif",
  },
];

export const precisionArchitectMenuItems = [
  {
    label: "Plans",
  },
  {
    label: "Bons de commandes",
  },
  {
    label: "PV",
    subMenu: ["Tous", "Avec réserves", "Sans réserves"],
  },
  {
    label: "Ordres de règlement",
  },
  {
    label: "DOE",
  },
];

export const projectMenuItems = [
  {
    subMenu: ["Tous", "Non commencés", "En cours", "Terminés", "Annulés"],
  },
];

export const precisionProjectItems = [
  {
    label: "Client",
  },
  {
    label: "Fournisseur",
  },
  {
    label: "Sous-traitant",
  },
  {
    label: "Architecte",
  },
];

export const projectContactMenuItems = [
  {
    label: "Client",
    subMenu: ["Devis", "Factures"],
  },
  {
    label: "Fournisseur",
    subMenu: ["Devis", "Factures", "Fiches techniques", "Bons pour accord"],
  },
  {
    label: "Sous-traitant",
    subMenu: ["Administratif", "Contrats", "Factures"],
  },
  {
    label: "Architecte",
    subMenu: [
      "Plans",
      "Bons de commandes",
      "PV",
      "Ordres de règlement",
      "Réserves",
      "Marchés",
      "DOE",
    ],
  },
];

export const dashboardMenuItems = [
  { label: "Gestion des droits" },
  { label: "Historique des actions" },
  { label: "Tampon de signature" },
];
