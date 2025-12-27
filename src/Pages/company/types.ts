import { z } from "zod";

export const companyFormSchema = z.object({
  directory: z.string().optional(),
  name: z.string().min(3, "Name is required"),
  mailingName: z.string().min(3, "Mailing name is required"),
  address: z.string().min(5, "Address is required"),
  country: z.string().min(3, "Country is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().optional(),
  phone: z.string().min(11, "Phone is required"),
  mobile: z.string().min(11, "Mobile is required"),
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
  numberOfDecimalPlaces: z.number().optional(),
  decimalPlacesInWords: z.number().optional(),
});

export type companyFormData = z.infer<typeof companyFormSchema>;