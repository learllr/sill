import React from "react";

const ActionButton = ({
  onClick,
  variant = "primary",
  disabled,
  children,
  type = "button",
}) => {
  const buttonStyles = {
    primary: "bg-primary text-white hover:bg-primary/80",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    green: "bg-green-500 text-white hover:bg-green-600",
    gray: "bg-gray-300 text-gray-700 hover:bg-gray-400",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`w-full p-2 rounded transition-colors duration-200 ${
        buttonStyles[variant]
      } ${
        disabled ? "opacity-50 cursor-not-allowed hover:bg-opacity-100" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default ActionButton;
