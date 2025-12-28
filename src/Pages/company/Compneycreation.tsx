import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "../../Components/Field";
import Select from "../../Components/Select";
import Section from "../../Components/Section";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { companyFormSchema } from "./types";
import type { Company } from "./types";
import { useAppDispatch } from "../../store/store";
import { createCompany } from "./slice";

const Compneycreation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Company>({
    resolver: zodResolver(companyFormSchema) as Resolver<Company>,
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
      website: undefined,
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
      // addSpaceBetweenAmountAndSymbol: "No",
      numberOfDecimalPlaces: undefined,
      // decimalPlacesInWords: undefined,
    },
  });

  const onSubmit = async (data: Company) => {
    await dispatch(createCompany(data)).unwrap();
    // Optionally navigate or show success here
  };

  const currencySymbols = ["₹", "$", "£", "€", "R$", "¥", "₨"];

  // helper: move focus to next/prev focusable element inside the form
  const moveFocus = (delta: number) => {
    const form = formRef.current;
    if (!form) return;
    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(Boolean);
    if (!focusable.length) return;

    const active = document.activeElement as HTMLElement | null;
    const idx = focusable.findIndex((el) => el === active);
    let next = 0;
    if (idx === -1) next = delta > 0 ? 0 : focusable.length - 1;
    else next = (idx + delta + focusable.length) % focusable.length;
    focusable[next].focus();
  };

  // keyboard handlers
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // If modal is open, handle modal-specific keys
      if (confirmOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
        }
        // allow 'y' and 'n' keys
        if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          submitFromModal();
          navigate("/");
        }
        if (e.key.toLowerCase() === "n") {
          e.preventDefault();
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
        }
        if(e.key === "Enter") {
          e.preventDefault();
          submitFromModal();
          navigate("/");
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/");
        return;
      }

      // if (formRef.current && formRef.current.contains(document.activeElement)) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          moveFocus(1);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          moveFocus(-1);
          return;
        }

        // Enter opens confirmation modal instead of submitting directly
        if (e.key === "Enter") {
          const active = document.activeElement as HTMLElement | null;
          const isTextArea = active?.tagName === "TEXTAREA";
          if (!isTextArea) {
            e.preventDefault();
            previouslyFocused.current = active ?? null;
            setConfirmOpen(true);
          }
        }
      // }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen, navigate]);

  const submitFromModal = () => {
    setConfirmOpen(false);
    previouslyFocused.current?.blur();
    // programmatically run react-hook-form submit
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <div className="w-full px-2 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md  font-semibold">
            Compney Creation
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-muted">Ctrl + M</h1>
          <button type="button" className=" text-[var(--text)]" aria-label="Close">
            <AiTwotoneCloseSquare className="w-5 h-5" onClick={() => navigate("/")} />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-surface px-6 py-1 overflow-auto transition-colors">
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-6">
            {/* LEFT */}
            <div>
              <Field
                label="Name"
                type="text"
                {...register("name")}
                error={errors.name?.message as string | undefined}
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
              {/* Books and Financial Year Details Section */}
              <Section title="Books and Financial Year Details">
                <Field
                  label="Financial year begins from"
                  type="date"
                  {...register("financialYearBeginsFrom")}
                  error={
                    errors.financialYearBeginsFrom?.message as
                      | string
                      | undefined
                  }
                />
                <Field
                  label="Books beginning from"
                  type="date"
                  {...register("booksBeginningFrom")}
                  error={
                    errors.booksBeginningFrom?.message as string | undefined
                  }
                />
              </Section>

              {/* Security Control Section */}
              <Section title="Security Control">
                <Field
                  label="TallyVault password (if any)"
                  type="password"
                  {...register("tallyVaultPassword")}
                  error={
                    errors.tallyVaultPassword?.message as string | undefined
                  }
                />
                <Field
                  label="Repeat password"
                  type="password"
                  {...register("repeatPassword")}
                  error={errors.repeatPassword?.message as string | undefined}
                />
                <p className="text-sm text-gray-500 mb-4 italic">
                  (Warning: Forgetting TallyVault password will render your data
                  inaccessible)
                </p>
                <Select
                  label="Use security control?"
                  options={["No", "Yes"]}
                  {...register("useSecurityControl")}
                  error={
                    errors.useSecurityControl?.message as string | undefined
                  }
                />
              </Section>
              <p className="text-sm italic">
                (Enable security to avail TSS features)
              </p>
            </div>
          </div>

          {/* Base Currency Information Section */}
          <div className="h-[1px] bg-gray-400 w-full"></div>
          <Section title="Base Currency Information">
            <div className="grid grid-cols-3 gap-x-8">
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
                error={
                  errors.SuffixSymbolToAmount?.message as string | undefined
                }
              />

              <Select
                label="Show amount in millions"
                options={["Yes", "No"]}
                {...register("ShowAmountInMillions")}
                error={
                  errors.ShowAmountInMillions?.message as string | undefined
                }
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
            </div>
          </Section>
        </form>

        {/* Confirmation modal (desktop-styled) */}
        {confirmOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm submit"
            onClick={() => {
              setConfirmOpen(false);
              previouslyFocused.current?.focus();
            }}
          >
            <div
              className="w-[200px] bg-surface  shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-md font-semibold mb-3">Confirm Submit</h2>
              {/* <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to submit the form?
              </p> */}

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  className="px-4 py-2  bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setConfirmOpen(false);
                    previouslyFocused.current?.focus();
                  }}
                >
                  No
                </button>
                <button
                  ref={yesButtonRef}
                  type="button"
                  className="px-4 py-2  bg-blue-600 text-white hover:bg-blue-700"
                  onClick={submitFromModal}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Compneycreation;
