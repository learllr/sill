import React from "react";

const DetailsDisplay = ({ data = [] }) => {
  const formatDate = (value) => {
    const date = new Date(value);
    if (isNaN(date)) return "Non spécifié";
    const formatted = date.toLocaleDateString("fr-FR").split("/").join(" / ");
    return formatted;
  };

  const formatPhoneNumber = (value) => {
    if (!value || typeof value !== "string") return "Non spécifié";
    return value.replace(/(\d{2})(?=\d)/g, "$1 ");
  };

  const formatPrice = (value) => {
    if (isNaN(value)) return "Non spécifié";
    return `${Number(value).toFixed(2)} €`;
  };

  const isSection = (item) => Array.isArray(item.items);

  const renderItems = (items, isSection) => (
    <div className={`space-y-1 ${isSection ? "pl-4" : ""}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center text-sm">
          <span className="font-medium text-gray-700 w-2/5">
            {item.label} :
          </span>
          <span className="text-gray-900">
            {item.isDate
              ? formatDate(item.value)
              : item.isPhone
              ? formatPhoneNumber(item.value)
              : item.isPrice
              ? formatPrice(item.value)
              : item.value || "Non spécifié"}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {isSection(data[0])
        ? data.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.section && (
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-gray-800">
                    {section.section}
                  </h2>
                  <hr className="border-gray-300" />
                </div>
              )}
              {renderItems(section.items, true)}
            </div>
          ))
        : renderItems(data, false)}
    </div>
  );
};

export default DetailsDisplay;
