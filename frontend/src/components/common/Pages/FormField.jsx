import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import Combobox from "../../common/Buttons/Combobox.jsx";

const formatDate = (value) => {
  const date = new Date(value);
  if (isNaN(date)) return "Non spécifié";
  return date.toLocaleDateString("fr-FR").split("/").join("/");
};

const FormField = React.forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder = "",
      options = [],
      comboboxOptions = [],
      required = false,
      errors = {},
      value = "",
      onChange,
      isDate = false,
      ...rest
    },
    ref
  ) => {
    const errorMessage = errors?.[name]?.message || "";

    const formattedValue = isDate && value ? formatDate(value) : value;

    return (
      <div className="space-y-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-800"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div>
          {type === "combobox" ? (
            <Combobox
              subjects={comboboxOptions}
              placeholder={placeholder}
              defaultValue={value}
              onSelect={onChange}
            />
          ) : type === "select" ? (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger ref={ref} className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : type === "textarea" ? (
            <Textarea
              ref={ref}
              id={name}
              name={name}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="w-full"
              {...rest}
            />
          ) : (
            <Input
              ref={ref}
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={formattedValue}
              onChange={onChange}
              className="w-full"
              {...rest}
            />
          )}
        </div>
        {errorMessage && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    );
  }
);

export default FormField;
