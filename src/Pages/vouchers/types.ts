import { z } from "zod"

export const groupSchema = z.object({
    name: z
        .string()
        .min(1, "*")
        .max(100, "Name is too long"),
    alias: z.string().optional(),
    selecttupeofvoucher: z.string(),
    abbrivation: z.string().optional(),
    methodofvouchernumbering: z.string(),
    useadvanceconfiguration: z.enum(["Yes", "No"]),
    useeffectivedateforvoucher: z.enum(["Yes", "No"]),
    makevouchertypeoptionalbydefault: z.enum(["Yes", "No"]),
    allownarrationinvoucher: z.enum(["Yes", "No"]),
    providenarrationforeachledgerinvoucher: z.enum(["Yes", "No"]),
    printvoucheraftersaving: z.enum(["Yes", "No"]),
    useforposinvoicing: z.enum(["Yes", "No"]),
    defaultprinttitle: z.string(),
    declaration: z.string(),
});

export type GroupFormValues = z.infer<typeof groupSchema>;