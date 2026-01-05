import { z } from "zod";

export const groupSchema = z.object({
  under: z.string().min(1, "Under group is required"),

  groups: z.array(
    z.object({
      name: z.string().min(1, "*").max(100, "Name is too long"),
      under: z.string(),
    })
  ).min(1),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
