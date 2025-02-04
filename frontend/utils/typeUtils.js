export const typeMapping = {
  1: { singular: "client", plural: "clients" },
  2: { singular: "fournisseur", plural: "fournisseurs" },
  3: { singular: "sous-traitant", plural: "sous-traitants" },
  4: { singular: "architecte", plural: "architectes" },
  employees: { singular: "salarié", plural: "salariés" },
};

export const getTypeName = (typeId, isPlural = true) => {
  const type = typeMapping[typeId];

  return type
    ? isPlural
      ? type.plural
      : type.singular
    : isPlural
    ? "Participants"
    : "Participant";
};
