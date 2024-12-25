import React from "react";

const DetailsDisplay = ({ data = [] }) => {
  const formatValue = (item) => {
    const {
      value,
      isDate,
      isPhone,
      isPrice,
      isPostalCode,
      type,
      comboboxOptions,
    } = item;

    if (!value && type !== "combobox") return "Non spécifié";

    switch (true) {
      case type === "combobox": {
        const selectedOption = comboboxOptions?.find(
          (option) => option.value === value
        );
        return selectedOption?.label || "Non spécifié";
      }

      case isDate: {
        const date = new Date(value);
        if (isNaN(date)) return value;
        return date.toLocaleDateString("fr-FR").split("/").join("/");
      }

      case isPhone:
        return typeof value === "string"
          ? value.replace(/(\d{2})(?=\d)/g, "$1 ")
          : "Non spécifié";

      case isPrice:
        return !isNaN(value) ? `${Number(value).toFixed(2)} €` : "Non spécifié";

      case isPostalCode:
        return typeof value === "string" && value.length >= 5
          ? `${value.slice(0, 2)} ${value.slice(2)}`
          : "Non spécifié";

      default:
        return value || "Non spécifié";
    }
  };

  const isSection = (item) => Array.isArray(item.items);

  const renderItems = (items, isSection) => (
    <div className={`space-y-1 ${isSection ? "pl-4" : ""}`}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center text-sm">
          <span className="font-medium text-gray-700 w-2/5">
            {item.label} :
          </span>
          <span className="text-gray-900">{formatValue(item)}</span>
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
