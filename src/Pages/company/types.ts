import { z } from "zod";

export const companyFormSchema = z.object({
  // directory: z.string().optional(),
  name: z.string().min(1, " "),
  mailingName: z.string().min(1, " "),
  address: z.string().min(1, " "),
  country: z.string().min(1, " "),
  state: z.string().min(1, " "),
  pincode: z.string().optional(),
  phone: z.string().min(1, " "),
  mobile: z.string().min(1, " "),
  fax: z.string().optional(),
  email: z.email(" "),
  website: z.string().optional(),
  financialYearBeginsFrom: z.string().min(1, " "),
  booksBeginningFrom: z.string().min(1, " "),
  tallyVaultPassword: z.string().optional(),
  repeatPassword: z.string().optional(),
  useSecurityControl: z.enum(["No", "Yes"]).default("No"),
  baseCurrencySymbol: z.string().optional(),
  SuffixSymbolToAmount: z.string().optional(),
  ShowAmountInMillions: z.enum(["No", "Yes"]).optional(),
  wordAfterDecimal: z.string().optional(),
  formalName: z.string().optional(),
  // addSpaceBetweenAmountAndSymbol: z.enum(["No", "Yes"]).optional(),
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
  // decimalPlacesInWords: z.preprocess((val) => {
  //   if (val === "" || val === null) return undefined;
  //   if (typeof val === "number" && Number.isNaN(val)) return undefined;
  //   if (typeof val === "string") {
  //     const n = Number(val);
  //     return Number.isNaN(n) ? undefined : n;
  //   }
  //   return val;
  // }, z.number().optional()),
});

export type Company = z.infer<typeof companyFormSchema>;


export interface CompanyFromBackend extends Company {
  _id: string;
  createdAt: string;
  updatedAt: string;
}