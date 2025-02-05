import React from "react";
import { Link } from "react-router-dom";

const DetailsDisplay = ({ data = [] }) => {
  const formatValue = (item) => {
    const {
      value,
      isPhone,
      isPrice,
      isPostalCode,
      type,
      comboboxOptions,
      link,
      isExternal = false,
    } = item;

    if (!value && type !== "combobox") return "Non spécifié";

    let formattedValue;

    switch (true) {
      case type === "combobox": {
        const selectedOption = comboboxOptions?.find(
          (option) => option.value === value
        );
        formattedValue = selectedOption?.label || "Non spécifié";
        break;
      }

      case isPhone:
        formattedValue =
          typeof value === "string"
            ? value.replace(/(\d{2})(?=\d)/g, "$1 ")
            : "Non spécifié";
        break;

      case isPrice:
        formattedValue = !isNaN(value)
          ? `${Number(value).toFixed(2)} €`
          : "Non spécifié";
        break;

      case isPostalCode:
        formattedValue =
          typeof value === "string" && value.length >= 5
            ? `${value.slice(0, 2)} ${value.slice(2)}`
            : "Non spécifié";
        break;

      default:
        formattedValue = value || "Non spécifié";
    }

    if (link) {
      return isExternal ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {formattedValue}
        </a>
      ) : (
        <Link to={link} className="text-blue-600 hover:underline">
          {formattedValue}
        </Link>
      );
    }

    return formattedValue;
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
