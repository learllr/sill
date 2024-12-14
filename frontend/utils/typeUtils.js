export const typeMapping = {
  1: { singular: "Fournisseur", plural: "Fournisseurs" },
  2: { singular: "Sous-traitant", plural: "Sous-traitants" },
  3: { singular: "Client", plural: "Clients" },
  4: { singular: "Architecte", plural: "Architectes" },
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
