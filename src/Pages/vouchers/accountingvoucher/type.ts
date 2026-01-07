import { z } from "zod";

export const voucherSchema = z.object({
  date: z.string().optional(),
  accounts: z.string().optional(),
  ledgers: z.string().optional(),
  amount: z.string().optional(),
  narrations: z.string().optional(),

   numberOfDecimalPlaces: z.preprocess((val) => {
    if (val === "" || val === null) return undefined;
    if (typeof val === "number" && Number.isNaN(val)) return undefined;
    // If it's a string like "2", convert to number
    if (typeof val === "string") {
      const n = Number(val);
      return Number.isNaN(n) ? undefined : n;
    }
    return val;
  }, z.number().optional()),
});

export type VoucherValue = z.infer<typeof voucherSchema>;




