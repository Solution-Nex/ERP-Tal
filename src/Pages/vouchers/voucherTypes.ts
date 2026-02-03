import { z } from "zod";

export const voucherTypeSchema = z.object({
  cmpId: z.string().min(1, " "),
  name: z.string().min(1, " "),
  alias: z.string().optional(),
  typeOfVoucher: z.string().min(1, " "),
  useEffectiveDateForVoucher: z.enum(["Yes", "No"]),
  makeVoucherTypeOptionalByDefault: z.enum(["Yes", "No"]),
  allowNarrationInVoucher: z.enum(["Yes", "No"]),
  provideNarrationForEachLedgerInVoucher: z.enum(["Yes", "No"]),
  printVoucherAfterSaving: z.enum(["Yes", "No"]),
  classname: z.string().optional(),
});

export type VoucherTypeFormData = z.infer<typeof voucherTypeSchema>;

export interface VoucherTypeFromBackend extends VoucherTypeFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}
