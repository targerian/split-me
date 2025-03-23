import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBillSplitter } from "@/hooks/useBillSplitter";
import { BillInput } from "@/screens/home/bill-input";
import { TaxesInput } from "@/screens/home/tax-input";

export default function Home() {
  const {
    formMethods,
    taxesArray,
    chargesArray,
    taxPercentage,
    chargesTotal,
  } = useBillSplitter();

  const { handleSubmit, register } = formMethods;

  const onSubmit = () => {

  };

  return (
    <div className="container mt-20">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-start justify-center h-full w-full">
          <h1 className="text-lg font-bold mb-4">Bill Description</h1>

          <div className="flex flex-start justify-between items-start w-full gap-4 mb-4">
            <BillInput formMethods={formMethods} taxPercentage={taxPercentage} />
            <TaxesInput formMethods={formMethods} taxesArray={taxesArray} />
          </div>

          <Separator className="w-full bg-slate-200 mb-2" />

          <h2 className="text-lg font-bold mb-4">Your Charges</h2>
          <div className="flex flex-col items-start justify-start gap-2 mb-4 w-full">
            {chargesArray.fields.map((field, index) => (
              <div key={field.id} className="flex justify-end items-center gap-2 w-75">
                <Input
                  placeholder={`Charge ${index + 1}`}
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  {...register(`charges.${index}.amount`, { valueAsNumber: true })}
                />
                {index === chargesArray.fields.length - 1 && (
                  <button
                    onClick={() => chargesArray.append({ amount: null })}
                    className="text-white p-1 cursor-pointer rounded-md outline outline-slate-50 hover:bg-slate-500 transition-colors"
                  >
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
                  <span className="text-sm text-slate-500">
                    {" "}(including {Number.isInteger(taxPercentage) ? taxPercentage : taxPercentage.toFixed(2)}% tax)
                  </span>
                )}
              </>
            )}
          </span>
        </div>
      </form>
    </div>
  );
}
