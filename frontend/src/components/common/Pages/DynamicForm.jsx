import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import FormField from "./FormField";

export default function DynamicForm({ fields, onSubmit, onCancel }) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {fields.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {section.section}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((field, fieldIndex) => (
              <Controller
                key={fieldIndex}
                name={field.name}
                control={control}
                defaultValue={field.value || ""}
                rules={{ required: field.required }}
                render={({ field: { value, onChange, ...restField } }) => (
                  <FormField
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    options={field.options || []}
                    required={field.required || false}
                    errors={errors}
                    value={value}
                    onChange={onChange}
                    {...restField}
                  />
                )}
              />
            ))}
          </div>
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