export const sanitizeNullValues = (data) => {
  const sanitizedData = { ...data };

  Object.keys(sanitizedData).forEach((key) => {
    if (
      sanitizedData[key] === "" ||
      sanitizedData[key] === "null" ||
      sanitizedData[key] === "undefined"
    ) {
      sanitizedData[key] = null;
    }
  });

  return sanitizedData;
};
