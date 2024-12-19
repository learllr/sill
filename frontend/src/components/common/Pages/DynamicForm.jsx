import { Button } from "@/components/ui/button";
import React from "react";
import FormField from "../../common/Pages/FormField";

export default function DynamicForm({
  fields,
  register,
  errors,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {fields.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h2 className="text-base font-semibold text-gray-800 mb-4 border-b">
            {section.section}
          </h2>
          {section.items.map((field, fieldIndex) => (
            <FormField
              key={fieldIndex}
              label={field.label}
              name={field.name}
              type={field.type}
              required={field.required}
              register={register}
              defaultValue={field.value}
              options={field.options || []}
              errors={errors}
            />
          ))}
        </div>
      ))}
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCancel} variant="secondary">
          Annuler
        </Button>
        <Button type="submit">Enregistrer</Button>
      </div>
    </form>
  );
}
