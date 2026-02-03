import { z } from "zod";
import Salespartydetail from "./Salespartydetail";

export const voucherSchema = z.object({
  date: z.string().optional(),
  accounts: z.string().optional(),
  ledgers: z.string().optional(),
  amount: z.string().optional(),
  narrations: z.string().optional(),
  deliveryNotesNo: z.string().optional(),
  despatchDocNo: z.string().optional(),
  despatchThrough: z.string().optional(),
  destination: z.string().optional(),
  orderNo: z.string().optional(),
  modeOfPayment: z.string().optional(),
  otherReference: z.string().optional(),
  termsOfDelivery: z.string().optional(),
  buyerName: z.string().optional(),
  buyerAddress: z.string().optional(),
  salesTaxNo: z.string().optional(),
  Salespartydetail: z.enum(["Yes", "No"]),

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




