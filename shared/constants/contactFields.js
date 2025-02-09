export const EMPLOYEE_FIELDS = [
  {
    name: "active",
    label: "Actif",
    type: "checkbox",
    defaultValue: 1,
  },
  {
    name: "gender",
    label: "Genre",
    type: "select",
    options: ["Homme", "Femme"],
    required: true,
  },
  { name: "firstName", label: "Prénom", type: "text", required: true },
  { name: "lastName", label: "Nom", type: "text", required: true },
  { name: "birthDate", label: "Date de naissance", type: "date" },
  { name: "birthCity", label: "Ville de naissance", type: "text" },
  { name: "nationality", label: "Nationalité", type: "text" },
  {
    name: "familyStatus",
    label: "Statut familial",
    type: "select",
    options: ["Célibataire", "Marié", "Vie maritale"],
  },
  { name: "dependentChildren", label: "Enfants à charge", type: "number" },
  {
    name: "socialSecurityNumber",
    label: "Numéro de sécurité sociale",
    type: "text",
  },
  { name: "address", label: "Adresse", type: "text" },
  { name: "postalCode", label: "Code postal", type: "text" },
  { name: "city", label: "Ville", type: "text" },
  { name: "phone", label: "Téléphone", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "jobTitle", label: "Poste", type: "text" },
  { name: "qualification", label: "Qualification", type: "text" },
  {
    name: "contractType",
    label: "Type de contrat",
    type: "select",
    options: [
      "CDD",
      "CDI",
      "Contrat d'apprentissage",
      "Contrat de professionnalisation",
    ],
  },
  {
    name: "contractDurationMonths",
    label: "Durée du contrat (mois)",
    type: "number",
  },
  {
    name: "workTime",
    label: "Temps de travail",
    type: "select",
    options: ["Temps plein", "Temps partiel", "Mi-temps"],
  },
  {
    name: "monthlyNetSalary",
    label: "Salaire net mensuel (€)",
    type: "number",
  },
  { name: "weeklyHours", label: "Heures par semaine", type: "number" },
  { name: "startDate", label: "Date de début", type: "date" },
  { name: "endDate", label: "Date de fin", type: "date" },
  { name: "btpCard", label: "Carte BTP", type: "checkbox", defaultValue: 0 },
  {
    name: "medicalCheckupDate",
    label: "Date de visite médicale",
    type: "date",
  },
];

export const ALL_CONTACT_FIELDS = [
  { name: "name", label: "Nom de l'entreprise", type: "text", required: true },
  { name: "contactPersons", label: "Interlocuteur", type: "contactPersons" },
  { name: "address", label: "Adresse", type: "text" },
  { name: "website", label: "Site web", type: "text" },
];

export const CONTACT_FIELDS = {
  employee: EMPLOYEE_FIELDS,
  client: ALL_CONTACT_FIELDS,
  supplier: ALL_CONTACT_FIELDS,
  subcontractor: ALL_CONTACT_FIELDS,
  architect: ALL_CONTACT_FIELDS,
};
