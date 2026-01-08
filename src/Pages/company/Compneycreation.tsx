import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "../../Components/common/Field";
import Select from "../../Components/common/Select";
import Section from "../../Components/common/Section";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { companyFormSchema, type CompanyFromBackend } from "./types";
import type { Company } from "./types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  createCompany,
  deleteCompany,
  setEditing,
  updateCompany,
} from "./slice";

const CompanyCreation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isEditing, selectedCompany } = useAppSelector(
    (state) => state.company
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formRef = useRef<HTMLFormElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const defaultValues: Company = {
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
    numberOfDecimalPlaces: undefined,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Company>({
    resolver: zodResolver(companyFormSchema) as Resolver<Company>,
    defaultValues,
  });

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (isEditing && selectedCompany) {
      const { _id, ...company } = selectedCompany as CompanyFromBackend;
      reset(company);
    }
  }, [isEditing, selectedCompany, reset]);

  useEffect(() => {
    return () => {
      dispatch(setEditing(false));
    };
  }, [dispatch, location, navigate]);

  /* ================= SUBMIT LOGIC ================= */
  const onSubmit = async (data: Company) => {
    if (isEditing && selectedCompany) {
      await dispatch(updateCompany({ id: selectedCompany._id, data })).unwrap();
      dispatch(setEditing(false));
      setIsDeleting(false);
    } else {
      await dispatch(createCompany(data)).unwrap();
    }

    reset(defaultValues);
    navigate("/");
  };

  const confirmDelete = async () => {
    if (!selectedCompany) return;

    await dispatch(deleteCompany(selectedCompany._id)).unwrap();
    dispatch(setEditing(false));
    setIsDeleting(false);
    dispatch(setEditing(false));
    reset(defaultValues);
    navigate("/");
  };

  const closeModal = () => {
    setConfirmOpen(false);
    setIsDeleting(false);
    previouslyFocused.current?.focus();
  };

  const submitFromModal = () => {
    setConfirmOpen(false);
    previouslyFocused.current?.blur();

    if (isDeleting) {
      confirmDelete();
    } else {
      handleSubmit(onSubmit)();
    }
  };

  /* ================= FOCUS NAVIGATION ================= */
  const moveFocus = (delta: number) => {
    const form = formRef.current;
    if (!form) return;

    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );

    if (!focusable.length) return;

    const active = document.activeElement as HTMLElement | null;
    const index = focusable.indexOf(active ?? focusable[0]);
    const nextIndex = (index + delta + focusable.length) % focusable.length;

    focusable[nextIndex].focus();
  };

  /* ================= KEYBOARD HANDLING ================= */
  useEffect(() => {
    document.title = isEditing
      ? "Alter Company Details - SN ERP"
      : "Create New Company - SN ERP";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        dispatch(setEditing(false));
        setIsDeleting(false);
        navigate(-1);
      }
      const active = document.activeElement as HTMLElement | null;

      if (confirmOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsDeleting(false);
          closeModal();
        }

        if (e.key === "Enter" || e.key.toLowerCase() === "y") {
          e.preventDefault();
          submitFromModal();
        }

        if (e.key.toLowerCase() === "n") {
          e.preventDefault();
          setIsDeleting(false);
          closeModal();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setIsDeleting(false);
        setEditing(false);
        navigate("/");
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        previouslyFocused.current = active;
        setIsDeleting(true);
        setConfirmOpen(true);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveFocus(1);
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveFocus(-1);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        previouslyFocused.current = active;
        setConfirmOpen(true);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen, isEditing, navigate]);

  useEffect(() => {
    if (confirmOpen) yesButtonRef.current?.focus();
  }, [confirmOpen]);

  const currencySymbols = ["₹", "$", "£", "€", "R$", "¥", "₨"];

  return (
    <>
      <div className="w-full pt-10 flex items-center px-4 justify-between bg-gray-300">
        <h1 className="text-black text-md font-semibold">
          {isEditing ? "Alter Company Details" : "Company Creation"}
        </h1>
        <div className="flex gap-3 text-muted">
          <p>ctrl+M</p>
          <button
            type="button"
            onClick={() => {
              setIsDeleting(false);
              setEditing(false);
              navigate("/");
            }}
          >
            <AiTwotoneCloseSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-surface px-6 py-1 overflow-auto">
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-6">
            {/* LEFT */}
            <div>
              <Field
                label="Name"
                {...register("name")}
                error={errors.name?.message}
              />

              <Section title="Primary Mailing Details">
                <Field
                  label="Mailing name"
                  {...register("mailingName")}
                  error={errors.mailingName?.message}
                />
                <Field
                  label="Address"
                  {...register("address")}
                  error={errors.address?.message}
                />
                <Field
                  label="Country"
                  {...register("country")}
                  error={errors.country?.message}
                />
                <Field
                  label="State"
                  {...register("state")}
                  error={errors.state?.message}
                />
                <Field
                  label="Pincode"
                  {...register("pincode")}
                  error={errors.pincode?.message}
                />
              </Section>

              <Section title="Contact Details">
                <Field
                  label="Phone no."
                  {...register("phone")}
                  error={errors.phone?.message}
                />
                <Field
                  label="Mobile no."
                  {...register("mobile")}
                  error={errors.mobile?.message}
                />
                <Field
                  label="Fax no."
                  {...register("fax")}
                  error={errors.fax?.message}
                />
                <Field
                  label="E-mail"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <Field
                  label="Website"
                  {...register("website")}
                  error={errors.website?.message}
                />
              </Section>
            </div>

            {/* RIGHT */}
            <div>
              <Section title="Books and Financial Year Details">
                <Field
                  type="date"
                  label="Financial year begins from"
                  {...register("financialYearBeginsFrom")}
                />
                <Field
                  type="date"
                  label="Books beginning from"
                  {...register("booksBeginningFrom")}
                />
              </Section>

              <Section title="Security Control">
                <Field
                  type="password"
                  label="TallyVault password"
                  {...register("tallyVaultPassword")}
                />
                <Field
                  type="password"
                  label="Repeat password"
                  {...register("repeatPassword")}
                />
                <Select
                  label="Use security control?"
                  options={["No", "Yes"]}
                  {...register("useSecurityControl")}
                />
              </Section>
            </div>
          </div>

          <div className="h-[1px] bg-gray-400 my-4" />

          <Section title="Base Currency Information">
            <div className="grid grid-cols-3 gap-x-8">
              <Select
                label="Base currency symbol"
                options={currencySymbols}
                {...register("baseCurrencySymbol")}
              />
              <Field label="Formal name" {...register("formalName")} />
              <Select
                label="Suffix symbol to amount"
                options={["Yes", "No"]}
                {...register("SuffixSymbolToAmount")}
              />
              <Select
                label="Show amount in millions"
                options={["Yes", "No"]}
                {...register("ShowAmountInMillions")}
              />
              <Field
                type="number"
                label="Number of decimal places"
                {...register("numberOfDecimalPlaces", { valueAsNumber: true })}
              />
              <Field
                label="Word after decimal"
                {...register("wordAfterDecimal")}
              />
            </div>
          </Section>
        </form>

        {confirmOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={closeModal}
          >
            <div
              className="w-[300px] bg-surface p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-semibold mb-6">
                {isDeleting
                  ? "Confirm delete"
                  : isEditing
                  ? "Accept changes"
                  : "Confirm submission"}
              </h2>
              <div className="flex justify-between">
                <button onClick={closeModal}>No</button>
                <button ref={yesButtonRef} onClick={submitFromModal}>
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

export default CompanyCreation;
