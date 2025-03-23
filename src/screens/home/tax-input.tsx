import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../types/home-types";
import { UseFieldArrayReturn } from "react-hook-form";

interface TaxesInputProps {
  formMethods: UseFormReturn<FormValues>;
  taxesArray: UseFieldArrayReturn<FormValues, "taxes">;
}

export const TaxesInput = ({ formMethods, taxesArray }: TaxesInputProps) => {
  const { register, formState: { errors }, handleSubmit } = formMethods;
  const { fields, append } = taxesArray;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Input
        placeholder="Bill without taxes"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        {...register("billWithoutTaxes", {
          setValueAs: (value) => {
            if (value === "") return null;
            const num = Number(value);
            return isNaN(num) ? null : num;
          }
        })}
      />
      {errors.billWithoutTaxes && (
        <span className="text-red-400 text-xs">{errors.billWithoutTaxes.message}</span>
      )}
      <div className="relative w-full my-2">
        <Separator className="w-full bg-slate-200" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-slate-500">
          Or
        </span>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex justify-end items-center gap-2">
          <Input
            placeholder={`Tax ${index + 1}`}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            {...register(`taxes.${index}.amount`, {
              valueAsNumber: true,
              onChange: () => handleSubmit(() => { })()
            })}
          />
          {index === fields.length - 1 && (
            <button onClick={() => append({ amount: null })} className="text-white p-1 cursor-pointer rounded-md outline outline-slate-50 hover:bg-slate-500 transition-colors">
              <Plus />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}; 