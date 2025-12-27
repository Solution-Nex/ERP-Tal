import { z } from "zod";

export const companyFormSchema = z.object({
  directory: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  mailingName: z.string().min(1, "Mailing name is required"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  mobile: z.string().min(1, "Mobile is required"),
  fax: z.string().optional(),
  email: z.string().email("Invalid email address"),
  website: z.string().optional(),
  financialYearBeginsFrom: z.string().min(1, "Financial year is required"),
  booksBeginningFrom: z.string().min(1, "Books beginning is required"),
  tallyVaultPassword: z.string().optional(),
  repeatPassword: z.string().optional(),
  useSecurityControl: z.enum(["No", "Yes"]).default("No"),
  baseCurrencySymbol: z.string().optional(),
  SuffixSymbolToAmount: z.string().optional(),
  ShowAmountInMillions: z.enum(["No", "Yes"]).optional(),
  wordAfterDecimal: z.string().optional(),
  formalName: z.string().optional(),
  addSpaceBetweenAmountAndSymbol: z.enum(["No", "Yes"]).optional(),
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
  decimalPlacesInWords: z.preprocess((val) => {
    if (val === "" || val === null) return undefined;
    if (typeof val === "number" && Number.isNaN(val)) return undefined;
    if (typeof val === "string") {
      const n = Number(val);
      return Number.isNaN(n) ? undefined : n;
    }
    return val;
  }, z.number().optional()),
});

export type companyFormData = z.infer<typeof companyFormSchema>;