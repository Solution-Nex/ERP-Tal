import { z } from "zod";

export const groupSchema = z.object({
  under: z.string().min(1, "Under group is required"),

  groups: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, "*").max(100, "Name is too long"),
      alias: z.string().optional(),
      under: z.string(),
      behavesLikeSubLedger: z.enum(["Yes", "No"]).optional(),
      netDebitCredit: z.enum(["Yes", "No"]).optional(),
      usedForCalculation: z.enum(["Yes", "No"]).optional(),
      allocationMethod: z.string().optional(),
      companyId: z.string(),
    })
  ).min(1),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
