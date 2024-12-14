export const capitalizeFirstLetter = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const formatToUpperCase = (value) => {
  return value.toUpperCase();
};

export const highlightText = (text, query) => {
  if (!query) return text;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return parts
    .map((part, index) =>
      part.toLowerCase() === query.toLowerCase()
        ? `<span class="font-bold">${part}</span>`
        : part
    )
    .join("");
};

export const formatPhone = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
};
