import { z } from "zod";

export const voucherTypeSchema = z.object({
  startingNumber: z.string().optional(),
  width: z.string().optional(),
  prefixZero: z.enum(["Yes", "NO"]).optional(),
  restartApplicableFrom: z.string().optional(),
  restartStartingNumber: z.string().optional(),
  restartParticulars: z.enum(["Daily", "Weekly", "Never", "Yearly"]).optional(),
  prefixApplicableFrom: z.string().optional(),
  prefixParticulars: z.string().optional(),
  suffixApplicableFrom: z.string().optional(),
  suffixParticulars: z.string().optional(),

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

export type VoucherTypeValue = z.infer<typeof voucherTypeSchema>;
