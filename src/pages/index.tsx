import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

const formSchema = z.object({
  billAmount: z.number({
    required_error: "Bill amount is required",
    invalid_type_error: "Bill amount must be a number",
  }).nullable(),
  billWithoutTaxes: z.number({
    invalid_type_error: "Bill without taxes must be a number",
  }).nullable(),
  taxes: z.array(
    z.object({
      amount: z.number({
        invalid_type_error: "Tax amount must be a number",
      }).nullable(),
    })
  ),
  charges: z.array(
    z.object({
      amount: z.number({
        invalid_type_error: "Charge amount must be a number",
      }).nullable(),
    })
  ),
}).refine(
  (data) => {
    const hasBillWithoutTaxes = data.billWithoutTaxes !== null;
    const hasTaxes = data.taxes.some(tax => tax.amount !== null);
    return !(hasBillWithoutTaxes && hasTaxes); // Should not have both
  },
  {
    message: "You can only fill either 'Bill without taxes' or individual tax amounts, not both",
    path: ["billWithoutTaxes"], // This will show the error under billWithoutTaxes field
  }
).refine(
  (data) => {
    if (data.billAmount === null || data.billWithoutTaxes === null) return true;
    return data.billWithoutTaxes <= data.billAmount;
  },
  {
    message: "Bill without taxes cannot be higher than total bill amount",
    path: ["billWithoutTaxes"],
  }
);

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const { register, control, watch, formState: { errors }, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      billAmount: null,
      billWithoutTaxes: null,
      taxes: [{ amount: null }],
      charges: [{ amount: null }],
    },
    resolver: zodResolver(formSchema),
    mode: "onChange",
    shouldUnregister: true
  });

  const { fields, append } = useFieldArray({
    control,
    name: "taxes",
  });
  const { fields: chargesFields, append: appendCharges } = useFieldArray({
    control,
    name: "charges",
  });

  const [taxPercentage, setTaxPercentage] = useState<number | null>(null);
  const [chargesTotal, setChargesTotal] = useState<number>(0);

  // First useEffect for tax percentage calculation
  useEffect(() => {
    const subscription = watch((value) => {
      const formValues = value as FormValues;
      const { billAmount, billWithoutTaxes, taxes } = formValues;

      // If billAmount is not provided, we can't calculate
      if (!billAmount) {
        setTaxPercentage(null);
        return;
      }

      // Method 1: Using billWithoutTaxes
      if (billWithoutTaxes) {
        const percentage = ((billAmount - billWithoutTaxes) / billWithoutTaxes) * 100;
        setTaxPercentage(percentage);
        return;
      }

      // Method 2: Using taxes array
      const taxesSum = taxes.reduce((sum, tax) => sum + (tax.amount || 0), 0);
      if (taxesSum > 0) {
        const calculatedBillWithoutTaxes = billAmount - taxesSum;
        const percentage = (taxesSum / calculatedBillWithoutTaxes) * 100;
        setTaxPercentage(percentage);
        return;
      }

      setTaxPercentage(null);
    });

    return () => subscription.unsubscribe();
  }, [watch]);


  // New useEffect for total charges calculation
  useEffect(() => {
    const subscription = watch((value) => {
      const formValues = value as FormValues;
      const { charges } = formValues;

      // Sum all charges
      const chargesSum = charges.reduce((sum, charge) => sum + (charge.amount || 0), 0);

      // If we have a tax percentage, add it to the total
      if (taxPercentage !== null && chargesSum > 0) {
        const taxAmount = (chargesSum * taxPercentage) / 100;
        setChargesTotal(chargesSum + taxAmount);
      } else {
        setChargesTotal(chargesSum);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, taxPercentage]);

  // Add this function to see form data and errors
  const onSubmit = () => {
    // console.log('Form data:', data);
  };


  return <div className="container mt-6">
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-start justify-center h-full w-full">
        <h1 className="text-lg font-bold mb-4">Bill Description</h1>
        <div className="flex flex-start justify-between items-start w-full gap-4 mb-4">
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
                    onChange: () => {
                      // Trigger validation immediately when tax input changes
                      handleSubmit(() => { })();
                    }
                  })}
                />
                {index === fields.length - 1 && (
                  <button onClick={() => append({ amount: null })} className=" text-white p-1 cursor-pointer rounded-md outline  outline-slate-50 hover:bg-slate-500 transition-colors">
                    <Plus />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <Separator className="w-full bg-slate-200 mb-2" />
        <h2 className="text-lg font-bold mb-4">Your Charges</h2>
        <div className="flex flex-col items-start justify-start gap-2 mb-4 w-full">
          {chargesFields.map((field, index) => (
            <div key={field.id} className="flex justify-end items-center gap-2 w-75">
              <Input
                placeholder={`Charge ${index + 1}`}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                {...register(`charges.${index}.amount`, { valueAsNumber: true })}
              />
              {index === chargesFields.length - 1 && (
                <button onClick={() => appendCharges({ amount: null })} className=" text-white p-1 cursor-pointer rounded-md outline  outline-slate-50 hover:bg-slate-500 transition-colors">
                  <Plus />
                </button>
              )}
            </div>
          ))}

        </div>
        <Separator className="w-full bg-slate-200 mb-2" />
        <h2 className="text-lg font-bold mb-2">Total amount of charges</h2>
        <span className="text-base text-slate-200">
          {chargesTotal > 0 && (
            <>
              You have to pay: {chargesTotal.toFixed(2)}
              {taxPercentage !== null && (
                <span className="text-sm text-slate-500"> (including {Number.isInteger(taxPercentage) ? taxPercentage : taxPercentage.toFixed(2)}% tax)</span>
              )}
            </>
          )}
        </span>

        {/* <pre className="text-red-500">
          {errors && JSON.stringify(
            Object.fromEntries(
              Object.entries(errors).map(([key, value]) => [key, value?.message])
            ),
            null,
            2
          )}
        </pre> */}

      </div>
    </form>
  </div>
}
