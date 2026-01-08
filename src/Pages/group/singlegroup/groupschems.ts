import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .min(1, "*")
    .max(100, "Name is too long"),

  alias: z.string().optional(),

  under: z.string().min(1, "Under group is required"),

  behavesLikeSubLedger: z.enum(["Yes", "No"]),

  netDebitCredit: z.enum(["Yes", "No"]),

  usedForCalculation: z.enum(["Yes", "No"]),

  allocationMethod: z
    .string()
    .min(1, "Allocation method is required"),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
