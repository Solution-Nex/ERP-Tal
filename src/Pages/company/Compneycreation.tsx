import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "../../Components/Field";
import Select from "../../Components/Select";
import Section from "../../Components/Section";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { companyFormSchema } from "./types";
import type { companyFormData } from "./types";

const Compneycreation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<companyFormData>({
    // resolver typing with zod can be noisy; silence with an explicit cast
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(companyFormSchema) as any,
    defaultValues: {
      directory: "",
      name: "",
      mailingName: "",
      address: "",
      country: "",
      state: "",
      pincode: "",
      phone: "",
      mobile: "",
      fax: "",
      email: "",
      website: "",
      financialYearBeginsFrom: new Date().toISOString().slice(0, 10),
      booksBeginningFrom: new Date().toISOString().slice(0, 10),
      tallyVaultPassword: "",
      repeatPassword: "",
      useSecurityControl: "No",
      baseCurrencySymbol: "",
      SuffixSymbolToAmount: "",
      ShowAmountInMillions: "No",
      wordAfterDecimal: "",
      formalName: "",
      addSpaceBetweenAmountAndSymbol: "No",
      numberOfDecimalPlaces: undefined,
      decimalPlacesInWords: undefined,
    },
  });

  const onSubmit = (data: companyFormData) => {
    console.log("Form submitted:", data);
  };

  // keep the commented arrays for future reference

  const currencySymbols = ["₹", "$", "£", "€", "R$", "¥", "₨"];

  return (
    <div className="flex-1 bg-surface p-6 overflow-auto transition-colors">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full py-4 flex items-center justify-between bg-surface">
          <div>
            <h1 className="capitalize text-black text-2xl  font-bold">
              Compney Creation
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-muted">Ctrl + M</h1>
            <button type="submit" className="text-2xl text-[var(--text)]">
              <AiTwotoneCloseSquare className="w-8 h-8" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT */}
          <div>
            <Field
              label="Directory"
              type="text"
              {...register("directory")}
              error={errors.directory?.message as string | undefined}
            />

            {/* Primary Mailing Details Section */}
            <Section title="Primary Mailing Details">
              <Field
                label="Mailing name"
                type="text"
                {...register("mailingName")}
                error={errors.mailingName?.message as string | undefined}
              />
              <Field
                label="Address"
                type="text"
                {...register("address")}
                error={errors.address?.message as string | undefined}
              />
              <Field
                label="Country"
                type="text"
                {...register("country")}
                error={errors.country?.message as string | undefined}
              />
              <Field
                label="State"
                type="text"
                {...register("state")}
                error={errors.state?.message as string | undefined}
              />
              <Field
                label="Pincode"
                type="text"
                {...register("pincode")}
                error={errors.pincode?.message as string | undefined}
              />
            </Section>

            {/* Contact Details Section */}
            <Section title="Contact Details">
              <Field
                label="Phone no."
                type="tel"
                {...register("phone")}
                error={errors.phone?.message as string | undefined}
              />
              <Field
                label="Mobile no."
                type="tel"
                {...register("mobile")}
                error={errors.mobile?.message as string | undefined}
              />
              <Field
                label="Fax no."
                type="tel"
                {...register("fax")}
                error={errors.fax?.message as string | undefined}
              />
              <Field
                label="E-mail"
                type="email"
                {...register("email")}
                error={errors.email?.message as string | undefined}
              />
              <Field
                label="Website"
                type="url"
                {...register("website")}
                error={errors.website?.message as string | undefined}
              />
            </Section>
          </div>

          {/* RIGHT */}
          <div>
            <Field
              label="Name"
              type="text"
              {...register("name")}
              error={errors.name?.message as string | undefined}
            />
            {/* Books and Financial Year Details Section */}
            <Section title="Books and Financial Year Details">
              <Field
                label="Financial year begins from"
                type="date"
                {...register("financialYearBeginsFrom")}
                error={
                  errors.financialYearBeginsFrom?.message as string | undefined
                }
              />
              <Field
                label="Books beginning from"
                type="date"
                {...register("booksBeginningFrom")}
                error={errors.booksBeginningFrom?.message as string | undefined}
              />
            </Section>

            {/* Security Control Section */}
            <Section title="Security Control">
              <Field
                label="TallyVault password (if any)"
                type="password"
                {...register("tallyVaultPassword")}
                error={errors.tallyVaultPassword?.message as string | undefined}
              />
              <Field
                label="Repeat password"
                type="password"
                {...register("repeatPassword")}
                error={errors.repeatPassword?.message as string | undefined}
              />
              <p className="text-md italic">
                (Warning: Forgetting TallyVault password will render your data
                inaccessible)
              </p>
              <Select
                label="Use security control?"
                options={["No", "Yes"]}
                {...register("useSecurityControl")}
                error={errors.useSecurityControl?.message as string | undefined}
              />
            </Section>
            <p className="text-md italic">
              (Enable security to avail TSS features)
            </p>
          </div>
        </div>

        {/* Base Currency Information Section */}
        <Section title="Base Currency Information">
          <div className="grid grid-cols-2 gap-x-8">
            <Select
              label="Base currency symbol"
              options={currencySymbols}
              {...register("baseCurrencySymbol")}
              error={errors.baseCurrencySymbol?.message as string | undefined}
            />

            <Field
              label="Formal name"
              type="text"
              {...register("formalName")}
              error={errors.formalName?.message as string | undefined}
            />

            <Select
              label="Suffix symbol to amount"
              options={["Yes", "No"]}
              {...register("SuffixSymbolToAmount")}
              error={errors.SuffixSymbolToAmount?.message as string | undefined}
            />

            <Select
              label="Add space between amount and symbol"
              options={["Yes", "No"]}
              {...register("addSpaceBetweenAmountAndSymbol")}
              error={
                errors.addSpaceBetweenAmountAndSymbol?.message as
                  | string
                  | undefined
              }
            />

            <Select
              label="Show amount in millions"
              options={["Yes", "No"]}
              {...register("ShowAmountInMillions")}
              error={errors.ShowAmountInMillions?.message as string | undefined}
            />

            <Field
              label="Number of decimal places"
              type="number"
              {...register("numberOfDecimalPlaces", { valueAsNumber: true })}
              error={
                errors.numberOfDecimalPlaces?.message as string | undefined
              }
            />

            <Field
              label="Word after decimal"
              type="text"
              {...register("wordAfterDecimal")}
              error={errors.wordAfterDecimal?.message as string | undefined}
            />

            <Field
              label="Decimal places in words"
              type="number"
              {...register("decimalPlacesInWords", { valueAsNumber: true })}
              error={errors.decimalPlacesInWords?.message as string | undefined}
            />
          </div>
        </Section>
      </form>
    </div>
  );
};

export default Compneycreation;
