// import { useEffect, useRef, useState } from "react";
// import { useForm, type Resolver } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Field from "../../Components/common/Field";
// import Select from "../../Components/common/Select";
// import Section from "../../Components/common/Section";
// import { AiTwotoneCloseSquare } from "react-icons/ai";
// import { companyFormSchema } from "./types";
// import type { Company } from "./types";
// import { useAppDispatch, useAppSelector } from "../../store/store";
// import {
//   createCompany,
//   deleteCompany,
//   setEditing,
//   updateCompany,
//   type CompanyFromBackend,
// } from "./slice";

// const Compneycreation = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const { isEditing, selectedCompany } = useAppSelector(
//     (state) => state.company
//   );
//   const [isDeleting, setIsDeleting] = useState<boolean>(false);
//   const formRef = useRef<HTMLFormElement | null>(null);
//   const yesButtonRef = useRef<HTMLButtonElement | null>(null);
//   const previouslyFocused = useRef<HTMLElement | null>(null);

//   const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

//   const defaultValues: Company = {
//     name: "",
//     mailingName: "",
//     address: "",
//     country: "",
//     state: "",
//     pincode: "",
//     phone: "",
//     mobile: "",
//     fax: "",
//     email: "",
//     website: undefined,
//     financialYearBeginsFrom: new Date().toISOString().slice(0, 10),
//     booksBeginningFrom: new Date().toISOString().slice(0, 10),
//     tallyVaultPassword: "",
//     repeatPassword: "",
//     useSecurityControl: "No",
//     baseCurrencySymbol: "",
//     SuffixSymbolToAmount: "",
//     ShowAmountInMillions: "No",
//     wordAfterDecimal: "",
//     formalName: "",
//     numberOfDecimalPlaces: undefined,
//   };

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<Company>({
//     resolver: zodResolver(companyFormSchema) as Resolver<Company>,
//     defaultValues: defaultValues,
//   });

//   //When editing, pass current values
//   useEffect(() => {
//     if (isEditing && selectedCompany) {
//       const { _id, ...company } = selectedCompany as CompanyFromBackend;
//       reset(company);
//     }
//   }, [isEditing, selectedCompany, reset]);

//   // Reset isEditing when component unmounts (user leaves without saving)
//   useEffect(() => {
//     return () => {
//       dispatch(setEditing(false));
//     };
//   }, [dispatch]);

//   //deleting process
//   const confirmDelete = async () => {
//     if (!selectedCompany) return;
//     await dispatch(deleteCompany(selectedCompany._id)).unwrap();
//     setIsDeleting(false);
//     dispatch(setEditing(false));
//     reset(defaultValues);
//     navigate("/");
//   };

//   // On form submit
//   const onSubmit = async (data: Company) => {
//     if (isEditing && selectedCompany) {
//       await dispatch(updateCompany({ id: selectedCompany._id, data })).unwrap();
//       dispatch(setEditing(false));
//     } else if (isDeleting && selectedCompany) {
//       confirmDelete();
//     } else {
//       await dispatch(createCompany(data)).unwrap();
//     }
//     reset(defaultValues);
//     navigate("/");
//   };

//   const currencySymbols = ["₹", "$", "£", "€", "R$", "¥", "₨"];

//   // move focus to next/prev focusable element inside the form
//   const moveFocus = (delta: number) => {
//     const form = formRef.current;
//     if (!form) return;
//     const focusable = Array.from(
//       form.querySelectorAll<HTMLElement>(
//         'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
//       )
//     ).filter(Boolean);
//     if (!focusable.length) return;

//     const active = document.activeElement as HTMLElement | null;
//     const idx = focusable.findIndex((el) => el === active);
//     let next = 0;
//     if (idx === -1) next = delta > 0 ? 0 : focusable.length - 1;
//     else next = (idx + delta + focusable.length) % focusable.length;
//     focusable[next].focus();
//   };

//   // keyboard handlers
//   useEffect(() => {
//     document.title = "Create new Company - SN ERP";
//     const handleKey = (e: KeyboardEvent) => {
//       //move between pages
//       if (e.key === "ArrowLeft") {
//         navigate(-1);
//       }
//       if (e.key === "ArrowRight") {
//         navigate(+1);
//       }

//       // If modal is open, handle modal-specific keys
//       if (confirmOpen) {
//         //escap key to close confirmaion model
//         if (e.key === "Escape") {
//           e.preventDefault();
//           setConfirmOpen(false);
//           previouslyFocused.current?.focus();
//         }
//         // allow 'y' and 'n' keys
//         if (e.key.toLowerCase() === "y") {
//           e.preventDefault();
//           e.stopPropagation();
//           submitFromModal();
//           // navigate("/");
//         }
//         if (e.key.toLowerCase() === "n") {
//           e.preventDefault();
//           e.stopPropagation();
//           setConfirmOpen(false);
//           previouslyFocused.current?.focus();
//         }
//         if (e.key.toLowerCase() === "enter") {
//           e.preventDefault();
//           e.stopPropagation();
//           submitFromModal();
//         }
//         return;
//       }

//       //Exit with ctrl+m
//       if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
//         e.preventDefault();
//         navigate("/");
//         return;
//       }

//       // if (formRef.current && formRef.current.contains(document.activeElement)) {
//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         moveFocus(1);
//         return;
//       }
//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         moveFocus(-1);
//         return;
//       }

//       // Enter opens confirmation modal instead of submitting directly
//       if (e.key.toLowerCase() === "enter") {
//         const active = document.activeElement as HTMLElement | null;
//         const isTextArea = active?.tagName === "TEXTAREA";
//         if (!isTextArea) {
//           e.preventDefault();
//           e.stopPropagation();
//           previouslyFocused.current = active ?? null;
//           setConfirmOpen(true);
//         }
//       }

//       //ctrl+d enable deletion
//       if (
//         (e.ctrlKey || e.metaKey) &&
//         e.key.toLowerCase() === "d" &&
//         isEditing
//       ) {
//         setIsDeleting(true);
//         const active = document.activeElement as HTMLElement | null;
//         const isTextArea = active?.tagName === "TEXTAREA";
//         if (!isTextArea) {
//           e.preventDefault();
//           e.stopPropagation();
//           previouslyFocused.current = active ?? null;
//           setConfirmOpen(true);
//         }
//       }
//     };

//     document.addEventListener("keydown", handleKey, true);
//     return () => {
//       document.removeEventListener("keydown", handleKey, true);
//     };
//   }, [confirmOpen, navigate, dispatch]);
//   // Submit from modal
//   const submitFromModal = () => {
//     setConfirmOpen(false);
//     previouslyFocused.current?.blur();
//     handleSubmit(onSubmit)();
//   };

//   return (
//     <>
//       <div className="w-full pt-10 flex items-center px-4 justify-between bg-gray-300">
//         <div>
//           <h1 className="capitalize text-black text-md font-semibold">
//             {isEditing ? "Alter Company Details" : "Compney Creation"}
//           </h1>
//         </div>
//         <div className="flex items-center gap-3">
//           <h1 className="text-muted">Ctrl + M</h1>
//           <button
//             type="button"
//             className=" text-[var(--text)]"
//             aria-label="Close"
//           >
//             <AiTwotoneCloseSquare
//               className="w-5 h-5"
//               onClick={() => navigate("/")}
//             />
//           </button>
//         </div>
//       </div>
//       <div className="flex-1 bg-surface px-6 py-1 overflow-auto transition-colors">
//         <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
//           <div className="grid grid-cols-2 gap-6">
//             {/* LEFT */}
//             <div>
//               <Field
//                 label="Name"
//                 type="text"
//                 {...register("name")}
//                 error={errors.name?.message as string | undefined}
//               />
//               {/* Primary Mailing Details Section */}
//               <Section title="Primary Mailing Details">
//                 <Field
//                   label="Mailing name"
//                   type="text"
//                   {...register("mailingName")}
//                   error={errors.mailingName?.message as string | undefined}
//                 />
//                 <Field
//                   label="Address"
//                   type="text"
//                   {...register("address")}
//                   error={errors.address?.message as string | undefined}
//                 />
//                 <Field
//                   label="Country"
//                   type="text"
//                   {...register("country")}
//                   error={errors.country?.message as string | undefined}
//                 />
//                 <Field
//                   label="State"
//                   type="text"
//                   {...register("state")}
//                   error={errors.state?.message as string | undefined}
//                 />
//                 <Field
//                   label="Pincode"
//                   type="text"
//                   {...register("pincode")}
//                   error={errors.pincode?.message as string | undefined}
//                 />
//               </Section>

//               {/* Contact Details Section */}
//               <Section title="Contact Details">
//                 <Field
//                   label="Phone no."
//                   type="tel"
//                   {...register("phone")}
//                   error={errors.phone?.message as string | undefined}
//                 />
//                 <Field
//                   label="Mobile no."
//                   type="tel"
//                   {...register("mobile")}
//                   error={errors.mobile?.message as string | undefined}
//                 />
//                 <Field
//                   label="Fax no."
//                   type="tel"
//                   {...register("fax")}
//                   error={errors.fax?.message as string | undefined}
//                 />
//                 <Field
//                   label="E-mail"
//                   type="email"
//                   {...register("email")}
//                   error={errors.email?.message as string | undefined}
//                 />
//                 <Field
//                   label="Website"
//                   type="url"
//                   {...register("website")}
//                   error={errors.website?.message as string | undefined}
//                 />
//               </Section>
//             </div>

//             {/* RIGHT */}
//             <div>
//               {/* Books and Financial Year Details Section */}
//               <Section title="Books and Financial Year Details">
//                 <Field
//                   label="Financial year begins from"
//                   type="date"
//                   {...register("financialYearBeginsFrom")}
//                   error={
//                     errors.financialYearBeginsFrom?.message as
//                       | string
//                       | undefined
//                   }
//                 />
//                 <Field
//                   label="Books beginning from"
//                   type="date"
//                   {...register("booksBeginningFrom")}
//                   error={
//                     errors.booksBeginningFrom?.message as string | undefined
//                   }
//                 />
//               </Section>

//               {/* Security Control Section */}
//               <Section title="Security Control">
//                 <Field
//                   label="TallyVault password (if any)"
//                   type="password"
//                   {...register("tallyVaultPassword")}
//                   error={
//                     errors.tallyVaultPassword?.message as string | undefined
//                   }
//                 />
//                 <Field
//                   label="Repeat password"
//                   type="password"
//                   {...register("repeatPassword")}
//                   error={errors.repeatPassword?.message as string | undefined}
//                 />
//                 <p className="text-sm text-gray-500 mb-4 italic">
//                   (Warning: Forgetting TallyVault password will render your data
//                   inaccessible)
//                 </p>
//                 <Select
//                   label="Use security control?"
//                   options={["No", "Yes"]}
//                   {...register("useSecurityControl")}
//                   error={
//                     errors.useSecurityControl?.message as string | undefined
//                   }
//                 />
//               </Section>
//               <p className="text-sm italic">
//                 (Enable security to avail TSS features)
//               </p>
//             </div>
//           </div>

//           {/* Base Currency Information Section */}
//           <div className="h-[1px] bg-gray-400 w-full"></div>
//           <Section title="Base Currency Information">
//             <div className="grid grid-cols-3 gap-x-8">
//               <Select
//                 label="Base currency symbol"
//                 options={currencySymbols}
//                 {...register("baseCurrencySymbol")}
//                 error={errors.baseCurrencySymbol?.message as string | undefined}
//               />

//               <Field
//                 label="Formal name"
//                 type="text"
//                 {...register("formalName")}
//                 error={errors.formalName?.message as string | undefined}
//               />

//               <Select
//                 label="Suffix symbol to amount"
//                 options={["Yes", "No"]}
//                 {...register("SuffixSymbolToAmount")}
//                 error={
//                   errors.SuffixSymbolToAmount?.message as string | undefined
//                 }
//               />

//               <Select
//                 label="Show amount in millions"
//                 options={["Yes", "No"]}
//                 {...register("ShowAmountInMillions")}
//                 error={
//                   errors.ShowAmountInMillions?.message as string | undefined
//                 }
//               />

//               <Field
//                 label="Number of decimal places"
//                 type="number"
//                 {...register("numberOfDecimalPlaces", { valueAsNumber: true })}
//                 error={
//                   errors.numberOfDecimalPlaces?.message as string | undefined
//                 }
//               />

//               <Field
//                 label="Word after decimal"
//                 type="text"
//                 {...register("wordAfterDecimal")}
//                 error={errors.wordAfterDecimal?.message as string | undefined}
//               />
//             </div>
//           </Section>
//         </form>

//         {/* Confirmation modal (desktop-styled) */}
//         {confirmOpen && (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//             role="dialog"
//             aria-modal="true"
//             aria-label="Confirm submit"
//             onClick={() => {
//               setConfirmOpen(false);
//               previouslyFocused.current?.focus();
//             }}
//           >
//             <div
//               className="w-[300px] bg-surface  shadow-xl p-6"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <h2 className="text-md font-semibold mb-6">
//                 {isDeleting
//                   ? "Confirm delete"
//                   : isEditing
//                   ? "Accept changes"
//                   : "Confirm Submission"}
//               </h2>
//               <div className="flex justify-between gap-3">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
//                   onClick={() => {
//                     setConfirmOpen(false);
//                     previouslyFocused.current?.focus();
//                   }}
//                 >
//                   No
//                 </button>
//                 <button
//                   ref={yesButtonRef}
//                   type="button"
//                   className="px-4 py-2  bg-blue-600 text-white hover:bg-blue-700"
//                   onClick={submitFromModal}
//                 >
//                   Yes
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Compneycreation;

import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "../../Components/common/Field";
import Select from "../../Components/common/Select";
import Section from "../../Components/common/Section";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { companyFormSchema } from "./types";
import type { Company } from "./types";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  createCompany,
  deleteCompany,
  setEditing,
  updateCompany,
  type CompanyFromBackend,
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
    document.title = "Create New Company - SN ERP";

    const handleKey = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";

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

      if (!isInput) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          moveFocus(1);
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          moveFocus(-1);
        }

        if (e.key === "Enter" && tag !== "BUTTON") {
          e.preventDefault();
          previouslyFocused.current = active;
          setConfirmOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKey, true);
    return () => document.removeEventListener("keydown", handleKey, true);
  }, [confirmOpen, isEditing, navigate]);

  useEffect(() => {
    if (confirmOpen) yesButtonRef.current?.focus();
  }, [confirmOpen]);

  const currencySymbols = ["₹", "$", "£", "€", "R$", "¥", "₨"];

  /* ================= UI ================= */
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
