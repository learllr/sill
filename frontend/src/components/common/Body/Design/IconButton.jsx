import React from "react";

export default function IconButton({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "gray",
}) {
  const baseStyles =
    "p-2 rounded-md transition flex items-center justify-center";

  const variants = {
    gray: "bg-gray-400 text-white hover:bg-gray-500",
    green: "bg-green-500 text-white hover:bg-green-600",
    blue: "bg-blue-500 text-white hover:bg-blue-600",
    red: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
    >
      {typeof children === "string"
        ? children
        : React.cloneElement(children, { className: "w-5 h-5" })}
    </button>
  );
}
