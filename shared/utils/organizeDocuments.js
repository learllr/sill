import { Months } from "../constants/general.js";

export function sortAndGroupDocuments(items) {
  const sortedItems = [...items].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return Months.indexOf(b.month) - Months.indexOf(a.month);
  });

  const groupedByYear = sortedItems.reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];
    acc[item.year].push(item);
    return acc;
  }, {});

  return groupedByYear;
}
