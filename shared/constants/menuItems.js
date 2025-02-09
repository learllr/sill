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
    subMenu: ["Devis", "Factures", "Devis validés"],
  },
];

export const precisionSupplierMenuItems = [
  {
    subMenu: ["Devis", "Factures", "Fiches techniques", "Bons pour accord"],
  },
];

export const precisionSubcontractorMenuItems = [
  {
    subMenu: ["Administratif", "Contrats", "Factures"],
  },
];

export const precisionArchitectMenuItems = [
  {
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

export const projectContactMenuItems = [
  {
    label: "Client",
    subMenu: ["Devis", "Factures", "Devis validés"],
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
