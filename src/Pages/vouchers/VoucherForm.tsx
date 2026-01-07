import { useEffect, useRef, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai"
import Field from "../../../src/Components/common/Field";
import Select from "../../../src/Components/common/Select";
import { groupSchema, type GroupFormValues } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

const Groups: FC = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const formRef = useRef<HTMLFormElement | null>(null);
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const undergroups = ['Bank Account', 'Capital Account', 'Asset details']

    {/*for display group */ }
    const mode = location.state?.mode ?? "create";
    const groupName = location.state?.groupName ?? "";

  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      alias: "",
      selecttupeofvoucher: "",
      abbrivation: "",
      methodofvouchernumbering: "Automatic",
      useadvanceconfiguration:"No",
      useeffectivedateforvoucher: "No",
      makevouchertypeoptionalbydefault: "Yes",
      allownarrationinvoucher: "No",
      providenarrationforeachledgerinvoucher: "No",
      printvoucheraftersaving: "No",
      useforposinvoicing: "No",
      defaultprinttitle: "",
      declaration: "",
    },
  });

     useEffect(() => {
        if (groupName) {
            setValue("name", groupName);
        }
    }, [groupName, setValue]);

  const useAdvanceConfig = useWatch({
  control,
  name: "useadvanceconfiguration",
});


  useEffect(() => {
  if (useAdvanceConfig === "Yes") {
    navigate("/advancevouchersetting");
  }
}, [useAdvanceConfig, navigate]);


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
          navigate("/voucher-type");
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

  const onSubmit = (data: GroupFormValues) => {
      if (mode === "create") {
          console.log("CREATE GROUP", data);
      }

      if (mode === "alter") {
          console.log("UPDATE GROUP", data);
      }
  };



  return (
    <div className="min-h-screen bg-transparent">
      {/*Header */}

      <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md  font-semibold">
            Voucher Type Creation
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
          className=" border-2 border-gray-400">
            <div className="w-full h-full p-3 border-b-2 border-gray-600">
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
              <Field
                label="Name"
                type="text"
                readOnly={mode==="display"}
                {...register("name")}
              />

              <Field
                label="(alice)"
                type="text"
                readOnly={mode==="display"}
                {...register("name")}
              />
            </div>
            <div className="w-full h-full flex items-stretch ">
              <div className="pt-5 border-r-2 border-gray-600 w-[40%] flex flex-col">
                <h1 className="underline text-lg font-bold text-center">General</h1>
                <div className="border-b-2 border-gray-600 p-4">
                  <Select
                    label="Select type of voucher"
                    options={undergroups}
                    {...register("selecttupeofvoucher")}
                  />
                  {errors.selecttupeofvoucher && (
                    <p className="text-red-600 text-sm">{errors.selecttupeofvoucher.message}</p>
                  )}
                  <Field
                    label="Abbriviation"
                    type="text"
                    readOnly={mode==="display"}
                    {...register("abbrivation")}
                  />
                </div>
                <div className="border-b-2 border-gray-600 p-4">
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
                </div>
                <div className="p-4 mb-5">
                  <Select
                    label="Use effective dates for voucher"
                    options={["No", "Yes"]}
                    {...register("useeffectivedateforvoucher")}
                  />

                  <Select
                    label={`Make this voucher type as "Optional" by default`}
                    options={["No", "Yes"]}
                    {...register("makevouchertypeoptionalbydefault")}
                  />

                  <Select
                    label="Allow narration in voucher"
                    options={["Yes", "NO"]}
                    {...register("allownarrationinvoucher")}
                  />

                  <Select
                    label="Provide narration for each ledger in voucher"
                    options={["Yes", "NO"]}
                    {...register("providenarrationforeachledgerinvoucher")}
                  />

                </div>
              </div>
              <div className=" w-[40%] pt-5 border-r-2 border-gray-600 flex flex-col">
                <h1 className="underline text-lg font-bold text-center">Printing</h1>
                <div className="p-4">
                  <Select
                    label="Print voucher after saving"
                    options={["Yes", "NO"]}
                    {...register("printvoucheraftersaving")}
                  />
                  <Select
                    label="Use for POS invoicing"
                    options={["Yes", "NO"]}
                    {...register("useforposinvoicing")}
                  />
                  <Field
                    label="Default print title"
                    type="text"
                    readOnly={mode==="display"}
                    {...register("defaultprinttitle")}
                  />
                  <Field
                    label="Declaration"
                    type="text"
                    readOnly={mode==="display"}
                    {...register("declaration")}
                  />
                </div>

              </div>
              <div className=" w-[20%] pt-5 flex flex-col">
                <h1 className="underline text-lg font-bold text-center">Name of Class</h1>
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
