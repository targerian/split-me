import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../../types/home-types";

interface BillInputProps {
  formMethods: UseFormReturn<FormValues>;
  taxPercentage: number | null;
}

export const BillInput = ({ formMethods, taxPercentage }: BillInputProps) => {
  const { register, formState: { errors } } = formMethods;

  return (
    <div className="flex flex-col justify-start item-start gap-2 w-full">
      <Input
        placeholder="Whole Bill amount"
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        {...register("billAmount", { valueAsNumber: true, required: "Bill amount is required" })}
      />
      {errors.billAmount && (
        <span className="text-red-500 text-sm">{errors.billAmount.message}</span>
      )}
      <span>Bill Info</span>
      {taxPercentage !== null && (
        <span className="text-sm text-slate-500">
          Tax Percentage: {Number.isInteger(taxPercentage) ? taxPercentage : taxPercentage.toFixed(2)}%
        </span>
      )}
    </div>
  );
}; 