import { useEffect, useRef, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import Field from "../../../src/Components/common/Field";
import Select from "../../../src/Components/common/Select";
import { voucherTypeSchema, type VoucherTypeFormData } from "./voucherTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { createVoucherType, updateVoucherType } from "./slice";

const VoucherForm: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formRef = useRef<HTMLFormElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const undergroups: string[] = [
    "Accountigng Vouchers",
    "Inventory Vouchers",
    "Payroll Vouchers",
    "Statutory Vouchers",
    "Other Vouchers",
  ];

  const selectedCompany = useAppSelector(
    (state) => state.company.selectedCompany
  );

  const mode = location.state?.mode ?? "create";
  const voucherType = location.state?.voucherType;

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<VoucherTypeFormData>({
    resolver: zodResolver(voucherTypeSchema),
    defaultValues: voucherType
      ? voucherType
      : {
          cmpId: selectedCompany?._id || "",
          name: "",
          alias: "",
          typeOfVoucher: "",
          useEffectiveDateForVoucher: "No",
          makeVoucherTypeOptionalByDefault: "Yes",
          allowNarrationInVoucher: "No",
          provideNarrationForEachLedgerInVoucher: "No",
          printVoucherAfterSaving: "No",
          classname: "",
        },
  });

  useEffect(() => {
    if (voucherType) {
      Object.keys(voucherType).forEach((key) => {
        setValue(key as keyof VoucherTypeFormData, voucherType[key]);
      });
    }
  }, [voucherType, setValue]);

  //   const useAdvanceConfig = useWatch({
  //   control,
  //   name: "useadvanceconfiguration",
  // });

  //   useEffect(() => {
  //   if (useAdvanceConfig === "Yes") {
  //     navigate("/advancevouchersetting");
  //   }
  // }, [useAdvanceConfig, navigate]);

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
        return;
      }
      if (e.key === "ArrowRight") {
        navigate(+1);
        return;
      }

      // If modal is open, handle modal-specific keys
      if (confirmOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
          return;
        }
        if (e.key.toLowerCase() === "y") {
          e.preventDefault();
          submitFromModal();
          return;
        }
        if (e.key.toLowerCase() === "n") {
          e.preventDefault();
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          submitFromModal();
          return;
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/");
        return;
      }

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

      // Enter: validate and open modal
      if (e.key === "Enter") {
        const active = document.activeElement as HTMLElement | null;
        
        if (mode !== "display") {
          e.preventDefault();
          previouslyFocused.current = active ?? null;
          
          // Just open the modal, don't submit yet
          setConfirmOpen(true);
        }
      }
    };
    
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen, navigate, handleSubmit, mode]);

  const submitFromModal = () => {
    setConfirmOpen(false);
    previouslyFocused.current?.blur();
    // programmatically run react-hook-form submit
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: VoucherTypeFormData) => {
    if (mode === "display") return;

    setLoading(true);
    try {
      if (mode === "create") {
        await dispatch(
          createVoucherType(data)
        ).unwrap();
      } else if (mode === "alter" && voucherType?._id) {
        await dispatch(
          updateVoucherType({
            id: voucherType._id,
            voucherTypeData: data,
          })
        ).unwrap();
      }

      setConfirmOpen(false);
      navigate("/voucher-type");
    } catch (error) {
      console.error("Error submitting voucher type:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 bg-transparent">
      {/*Header */}

      <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md font-semibold">
            Voucher Type {mode === "create" ? "Creation" : mode === "display" ? "View" : "Edit"}
          </h1>
        </div>
        <h1 className="capitalize text-black text-md font-semibold">
          {selectedCompany?.name}
        </h1>
        <div className="flex items-center gap-3">
          <h1 className="text-muted">Ctrl + M</h1>
          <button
            type="button"
            className=" text-[var(--text)]"
            aria-label="Close"
          >
            <AiTwotoneCloseSquare
              className="w-5 h-5"
              onClick={() => navigate("/")}
            />
          </button>
        </div>
      </div>

      {/* Main content */}
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className={`border-2 border-gray-400 ${mode === "display" ? "bg-gray-100" : ""}`}
      >
        <div className="w-full h-full p-3 border-b-2 border-gray-600">
          {mode === "display" && (
            <p className="text-sm text-blue-600 font-semibold mb-3">View Mode - Read Only</p>
          )}
          {mode === "alter" && (
            <p className="text-sm text-orange-600 font-semibold mb-3">Edit Mode - Press Enter to Update</p>
          )}
          {errors.name && (
            <p className="text-red-600 text-sm">{errors.name.message}</p>
          )}
          <Field
            label="Name"
            type="text"
            disabled={mode === "display"}
            {...register("name")}
          />

          {errors.alias && (
            <p className="text-red-600 text-sm">{errors.alias.message}</p>
          )}
          <Field
            label="Alias"
            type="text"
            disabled={mode === "display"}
            {...register("alias")}
          />
        </div>
        <div className="w-full h-full flex items-stretch ">
          <div className="pt-5 border-r-2 border-gray-600 w-[40%] flex flex-col">
            <h1 className="underline text-lg font-bold text-center">General</h1>
            <div className="border-b-2 border-gray-600 p-4">
              <Select
                label="Type of voucher"
                options={undergroups}
                disabled={mode === "display"}
                {...register("typeOfVoucher")}
              />
              {undergroups.length === 0 && (
                <p className="text-yellow-600 text-sm">No groups available</p>
              )}
              {errors.typeOfVoucher && (
                <p className="text-red-600 text-sm">
                  {errors.typeOfVoucher.message}
                </p>
              )}
            </div>
            {/* <div className="border-b-2 border-gray-600 p-4">
              <Select
                label="Method of voucher numbering"
                options={["Automatic", "mannual"]}
                {...register("methodofvouchernumbering")}
              />
              <Select
                label="Use advance configuration"
                options={["No", "Yes"]}
                {...register("useadvanceconfiguration")}
              />
            </div> */}
            <div className="p-4 mb-5">
              <Select
                label="Use effective dates for voucher"
                options={["No", "Yes"]}
                disabled={mode === "display"}
                {...register("useEffectiveDateForVoucher")}
              />

              <Select
                label={`Make as "Optional" by default`}
                options={["No", "Yes"]}
                disabled={mode === "display"}
                {...register("makeVoucherTypeOptionalByDefault")}
              />

              <Select
                label="Allow narration in voucher"
                options={["Yes", "No"]}
                disabled={mode === "display"}
                {...register("allowNarrationInVoucher")}
              />

              <Select
                label="Provide narration for each ledger in voucher"
                options={["Yes", "No"]}
                disabled={mode === "display"}
                {...register("provideNarrationForEachLedgerInVoucher")}
              />
            </div>
          </div>
          <div className=" w-[40%] pt-5 border-r-2 border-gray-600 flex flex-col">
            <h1 className="underline text-lg font-bold text-center">
              Printing
            </h1>
            <div className="p-4">
              <Select
                label="Print voucher after saving"
                options={["Yes", "No"]}
                disabled={mode === "display"}
                {...register("printVoucherAfterSaving")}
              />
            </div>
          </div>
          <div className=" w-[20%] pt-5 flex flex-col">
            <h1 className="underline text-lg font-bold text-center">
              Name of Class
            </h1>
            <div className="mx-auto my-5">
              <Field
                className="w-full"
                type="text"
                disabled={mode === "display"}
                {...register("classname")}
              />
            </div>
          </div>
        </div>

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
                  disabled={loading}
                >
                  No
                </button>
                <button
                  ref={yesButtonRef}
                  type="button"
                  className="px-4 py-2  bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={submitFromModal}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Yes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default VoucherForm;
