export function formatPostalCode(postalCode) {
  return postalCode.replace(/\D/g, "").replace(/^(\d{2})(\d{3})$/, "$1 $2");
}

export function formatPhoneNumber(phone) {
  return phone
    .replace(/\D/g, "")
    .replace(/(\d{2})(?=\d)/g, "$1 ")
    .trim();
}

export function formatUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

export function isDate(date) {
  return date && !isNaN(Date.parse(date));
}

export function formatDate(date) {
  if (!date || isNaN(Date.parse(date))) return "Date indisponible";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(date) {
  if (!date || isNaN(Date.parse(date))) return "Date indisponible";

  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatSocialSecurityNumber(ssn) {
  return ssn.replace(
    /^(\d{1,1})?(\d{0,2})?(\d{0,2})?(\d{0,2})?(\d{0,3})?(\d{0,3})?(\d{0,2})?$/,
    (_, a, b, c, d, e, f, g) => [a, b, c, d, e, f, g].filter(Boolean).join(" ")
  );
}

export function formatSalary(salary) {
  if (!salary) return "";

  let number = parseFloat(
    salary.toString().replace(/\s/g, "").replace(",", ".")
  );
  if (isNaN(number)) return salary;

  return number
    .toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/\s/g, " ");
}
