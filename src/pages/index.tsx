import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

type FormValues = {
  billAmount: number | null;
  billWithoutTaxes: number | null;
  taxes: { amount: number | null }[];
  charges: { amount: number | null }[];
};

export default function Home() {
  const { register, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      billAmount: null,
      taxes: [{ amount: null }],
      charges: [{ amount: null }],
    },
    reValidateMode: "onChange",
  });

  const { fields, append } = useFieldArray({
    control,
    name: "taxes",
  });
  const { fields: chargesFields, append: appendCharges } = useFieldArray({
    control,
    name: "charges",
  });



  return <div className="container ">
    <div className="flex flex-col items-start justify-center h-full w-full">
      <h1 className="text-lg font-bold">Bill Description</h1>
      <div className="flex flex-start justify-between items-start w-full gap-4 mb-2">
        <div className="flex flex-col justify-start item-start gap-2 w-full">
          <Input placeholder="Bill amount" type="number" {...register("billAmount", { valueAsNumber: true, required: "Bill amount is required" })} />
          {errors.billAmount && (
            <span className="text-red-500 text-sm">{errors.billAmount.message}</span>
          )}
          <span>bill info</span>

        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <Input placeholder="Bill  without taxes" type="number" {...register("billWithoutTaxes", { valueAsNumber: true })} />
          <div className="relative w-full my-2">
            <Separator className="w-full bg-slate-200" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-slate-500">
              Or
            </span>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex justify-end items-center gap-2">
              <Input placeholder={`Tax ${index + 1}`} type="number" {...register(`taxes.${index}.amount`, { valueAsNumber: true })} />
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
      <h2 className="text-lg font-bold mb-2">Your charges</h2>
      <div className="flex flex-col items-start justify-start gap-2 mb-4">
        {chargesFields.map((field, index) => (
          <div key={field.id} className="flex justify-end items-center gap-2">
            <Input placeholder={`Charge ${index + 1}`} type="number" {...register(`charges.${index}.amount`, { valueAsNumber: true })} />
            {index === chargesFields.length - 1 && (
              <button onClick={() => appendCharges({ amount: null })} className=" text-white p-1 cursor-pointer rounded-md outline  outline-slate-50 hover:bg-slate-500 transition-colors">
                <Plus />
              </button>
            )}
          </div>
        ))}

      </div>
      <Separator className="w-full bg-slate-200 mb-2" />
      <h2 className="text-lg font-bold mb-2">Total Amount of charges</h2>

    </div>

  </div>
}
