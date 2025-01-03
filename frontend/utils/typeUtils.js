export const typeMapping = {
  1: { singular: "Client", plural: "Clients" },
  2: { singular: "Fournisseur", plural: "Fournisseurs" },
  3: { singular: "Sous-traitant", plural: "Sous-traitants" },
  4: { singular: "Architecte", plural: "Architectes" },
  employees: { singular: "Salarié", plural: "Salariés" },
};

export const getTypeName = (typeId, isPlural = true) => {
  if (typeId === "employees") {
    const type = typeMapping.employees;
    return isPlural ? type.plural : type.singular;
  }

  const type = typeMapping[typeId];

  return type
    ? isPlural
      ? type.plural
      : type.singular
    : isPlural
    ? "Participants"
    : "Participant";
};
