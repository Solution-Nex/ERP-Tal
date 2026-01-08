import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai"
import Field from "../../../src/Components/common/Field";
import Select from "../../../src/Components/common/Select";
import { voucherTypeSchema, type VoucherTypeValue } from "./advancevocsetingschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

const Groups: FC = () => {
  const navigate = useNavigate()

  const formRef = useRef<HTMLFormElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);



  const defaultValues: VoucherTypeValue = {
    startingNumber: "",
    width: "",
    prefixZero: "NO",
    restartApplicableFrom: new Date().toISOString().slice(0, 10),
    restartStartingNumber: "",
    restartParticulars: "Daily",
    prefixApplicableFrom: new Date().toISOString().slice(0, 10),
    prefixParticulars: "",
    suffixApplicableFrom: new Date().toISOString().slice(0, 10),
    suffixParticulars: undefined,
  };


  const {
    register,
    // setValue,
    handleSubmit,
    // formState: { errors },
  } = useForm<VoucherTypeValue>({
    resolver: zodResolver(voucherTypeSchema) as Resolver<VoucherTypeValue>,
    defaultValues,
  });

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
    document.title = "Create single group - SN ERP";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigate(-1);
      }
      if (e.key === "ArrowRight") {
        navigate(+1);
      }

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
          e.stopPropagation();
          submitFromModal();
          navigate("/groups");
        }
        if (e.key.toLowerCase() === "n") {
          e.preventDefault();
          e.stopPropagation();
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/groups");
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

    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen, navigate]);


  const submitFromModal = () => {
    setConfirmOpen(false);
    previouslyFocused.current?.blur();
    // programmatically run react-hook-form submit
    handleSubmit(onSubmit)()
  };

  const onSubmit = (data: VoucherTypeValue) => {
    console.log(data)
    // if (mode === "create") {
    //     console.log("CREATE GROUP", data);
    // }

    // if (mode === "alter") {
    //     console.log("UPDATE GROUP", data);
    // }
  };



  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/*Header */}

      <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md  font-semibold">
            Voucher Type Attration (Secondry)
          </h1>
        </div>
        <h1 className="capitalize text-black text-md  font-semibold">
          Company name
        </h1>
        <div className="flex items-center gap-3">
          <h1 className="text-muted">Ctrl + M</h1>
          <button type="button" className=" text-[var(--text)]" aria-label="Close">
            <AiTwotoneCloseSquare className="w-5 h-5" onClick={() => navigate("/groups")} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="p-4 bg-white text-sm border border-gray-700 w-full flex-1 flex flex-col overflow-hidden">


        {/* Top Section  */}
        <div className="w-full p-3 ">
          <Field
            label="Starting Number"
            type="number"
            {...register("startingNumber")}
          />
          <Field
            label="Width of numerical part"
            type="number"
            {...register("width")}
          />
          <Select
            label="Prefill with ZERO"
            options={["NO", "Yes"]}
            {...register("prefixZero")}
          />
        </div>
        
          {/* Main Green Section */}
          <table className="w-full h-full flex-1 overflow-auto border border-gray-700 table-fixed ">
            <thead>
              <tr>
                <th className="border p-1 text-left">Restart Numbering</th>
                <th className="border p-1 text-left">Prefix Details</th>
                <th className="border p-1 text-left">Suffix Details</th>
              </tr>
            </thead>

            <tbody className="h-full">
              <tr className="h-full">
                {/* Restart Numbering*/}
                <td className="border p-2 align-top">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4" >
                      <label className="block p-1">Applicable From</label>
                      <input
                        type="date"
                        {...register("restartApplicableFrom")}
                        className="bg-gray-300 max-w-52 focus:bg-black focus:text-white outline-none w-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block p-1">Starting Number</label>
                      <input
                        type="number"
                        {...register("restartStartingNumber")}
                        className="bg-gray-300 max-w-52 focus:bg-black focus:text-white outline-none w-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block p-1">Particulars</label>
                      <select
                        {...register("restartParticulars")}
                        className="bg-gray-300 max-w-52 focus:bg-black focus:text-white outline-none w-full"
                      >
                        <option value="">Select</option>
                        <option value="Daily">Daily</option>
                        <option value="Weakly">Weakly</option>
                        <option value="Never">Never</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                </td>

                {/* ================= Prefix Details ================= */}
                <td className="border p-2 align-top">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <label className="block p-1">Applicable From</label>
                      <input
                        type="date"
                        {...register("prefixApplicableFrom")}
                        className="bg-gray-300 max-w-52 focus:bg-black focus:text-white outline-none w-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block p-1">Particulars</label>
                      <input
                        type="text"
                        {...register("prefixParticulars")}
                        className="bg-gray-300 max-w-52 focus:bg-black focus:text-white outline-none w-full"
                      />
                    </div>
                  </div>
                </td>

                {/* ================= Suffix Details ================= */}
                <td className="border p-2 align-top">
                  <div className="flex items-start justify-between ">
                    <div className="space-y-4">
                      <label className="block p-1">Applicable From</label>
                      <input
                        type="date"
                        {...register("suffixApplicableFrom")}
                        className="bg-gray-300 max-w-52 focus:bg-black focus:text-white outline-none w-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block p-1">Particulars</label>
                      <input
                        type="number"
                        {...register("suffixParticulars")}
                        className="bg-gray-300 max-w-52 focus:bg-black focus:text-white outline-none w-full"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>


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
      </form>


    </div>

  );
};
export default Groups;
