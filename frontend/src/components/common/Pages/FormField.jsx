import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const FormField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  register,
  options = [],
  required = false,
  errors = {},
  onChange,
  ...rest
}) => {
  const errorMessage = errors[name]?.message;

  const formatValue = (value) => {
    if (type === "date") {
      return value.replace(/(\d{2})(\d{2})(\d{2,4})/, "$1 / $2 / $3");
    }
    if (name === "phone") {
      return value.replace(/(\d{2})(?=\d)/g, "$1 ");
    }
    return value;
  };

  const handleChange = (e) => {
    const formattedValue = formatValue(e.target.value);
    e.target.value = formattedValue;
    if (onChange) onChange(e);
  };

  return (
    <div className="space-y-1 mt-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "select" ? (
        <Select {...rest}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder || "Sélectionner"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : type === "textarea" ? (
        <Textarea
          {...register(name, { required })}
          placeholder={placeholder}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          {...rest}
          onChange={handleChange}
        />
      ) : (
        <Input
          {...register(name, { required })}
          type={type}
          placeholder={placeholder}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          {...rest}
          onChange={handleChange}
        />
      )}
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default FormField;
