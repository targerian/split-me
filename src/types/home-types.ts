import { z } from "zod";

export const formSchema = z.object({
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
    return !(hasBillWithoutTaxes && hasTaxes);
  },
  {
    message: "You can only fill either 'Bill without taxes' or individual tax amounts, not both",
    path: ["billWithoutTaxes"],
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

export type FormValues = z.infer<typeof formSchema>; 