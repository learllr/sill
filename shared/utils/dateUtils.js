import dayjs from "dayjs";

export const calculateAge = (birthDate) => {
  const now = dayjs();
  const birth = dayjs(birthDate);
  const years = now.diff(birth, "year");

  if (years > 1) {
    return `${years} ans`;
  } else {
    const months = now.diff(birth, "month");
    return `${months} mois`;
  }
};
