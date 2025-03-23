import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { FormValues, formSchema } from "../types/home-types";

export const formDefaultValues: FormValues = {
  billAmount: null,
  billWithoutTaxes: null,
  taxes: [{ amount: null }],
  charges: [{ amount: null }],
};
export const useBillSplitter = () => {
  const [taxPercentage, setTaxPercentage] = useState<number | null>(null);
  const [chargesTotal, setChargesTotal] = useState<number>(0);


  const formMethods = useForm<FormValues>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(formSchema),
    mode: "onChange",
    shouldUnregister: true,
    shouldFocusError: false
  });

  const { control, watch, reset } = formMethods;

  const taxesArray = useFieldArray({
    control,
    name: "taxes",
  });

  const chargesArray = useFieldArray({
    control,
    name: "charges",
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const formValues = value as FormValues;
      const { billAmount, billWithoutTaxes, taxes = [] } = formValues;

      if (!billAmount) {
        setTaxPercentage(null);
        return;
      }

      if (billWithoutTaxes) {
        const percentage = ((billAmount - billWithoutTaxes) / billWithoutTaxes) * 100;
        setTaxPercentage(percentage);
        return;
      }

      if (taxes && taxes.length > 0) {
        const taxesSum = taxes.reduce((sum, tax) => sum + (tax?.amount || 0), 0);
        if (taxesSum > 0) {
          const calculatedBillWithoutTaxes = billAmount - taxesSum;
          const percentage = (taxesSum / calculatedBillWithoutTaxes) * 100;
          setTaxPercentage(percentage);
          return;
        }
      }

      setTaxPercentage(null);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const subscription = watch((value) => {
      const formValues = value as FormValues;
      const { charges = [] } = formValues;

      if (charges && charges.length > 0) {
        const chargesSum = charges.reduce((sum, charge) => sum + (charge?.amount || 0), 0);

        if (taxPercentage !== null && chargesSum > 0) {
          const taxAmount = (chargesSum * taxPercentage) / 100;
          setChargesTotal(chargesSum + taxAmount);
        } else {
          setChargesTotal(chargesSum);
        }
      } else {
        setChargesTotal(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, taxPercentage]);

  return {
    formMethods,
    taxesArray,
    chargesArray,
    taxPercentage,
    chargesTotal,
    reset,
  };
}; 