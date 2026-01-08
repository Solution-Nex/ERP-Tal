import { useEffect, useRef, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai"
import Field from "../../../Components/common/Field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Select from "../../../Components/common/Select";
import { groupSchema, type GroupFormValues } from "./groupschems";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { createGroup, updateGroup } from "../slice";



const Groups: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const selectedGroup = location.state?.group || {};

    const formRef = useRef<HTMLFormElement | null>(null);
    const yesButtonRef = useRef<HTMLButtonElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const selectedCompany = useAppSelector((state) => state.company.selectedCompany);


    const undergroups = ['Bank Account', 'Capital Account', 'Asset details']

    useEffect(() => {
      selectedCompany ?? navigate("/select-company");
    },[selectedCompany, navigate]);

    {/*for display group */ }
    const mode = location.state?.mode ?? "create";
    const group = location.state?.group ?? "";

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<GroupFormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            behavesLikeSubLedger: "No",
            netDebitCredit: "No",
            usedForCalculation: "No",
            allocationMethod: "Not Applicable",
        },
    });

    useEffect(() => {
        if (group) {
            setValue("name", group);
        }
    }, [group, setValue]);

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
                if (e.key.toLowerCase() === "y" || e.key.toLocaleLowerCase() === "enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    submitFromModal();
                    // if(mode === "create"){
                    //     navigate("/select-group");
                    // }else{
                    //     navigate("/select-group");
                    // }
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
                navigate("/select-group");
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
                if (mode === "display") {
                    e.preventDefault();
                    moveFocus(1);
                    return;
                }
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
            dispatch(createGroup(data));
            navigate("/select-group");
        }

        if (mode === "alter") {
          dispatch(updateGroup({ id: selectedGroup._id, data: data }));
          navigate("/select-group");
          console.log("UPDATE GROUP", data);
        }
    };



    return (
      <div className="min-h-screen flex flex-col bg-transparent">
        {/*Header */}

        <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
          <div>
            <h1 className="capitalize text-black text-md  font-semibold">
              {mode === "create"
                ? "Create Group"
                : mode === "display"
                ? "View Group"
                : mode === "alter"
                ? "Update the Value"
                : "Gateway of Tally"}
            </h1>
          </div>
          <h1 className="capitalize text-black text-md  font-semibold">
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
                onClick={() => navigate("/select-group")}
              />
            </button>
          </div>
        </div>

        {/* Main content */}
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 border-r-2 border-gray-400 px-2 w-[45%]"
        >
          <div className=" w-full px-4 py-4 mb-3 border-b-2 border-gray-400 ">
            <div className="mb-6">
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
              <Field
                label="Name"
                type="text"
                readOnly={mode === "display"}
                {...register("name")}
              />

              <Field
                label="(alice)"
                type="text"
                readOnly={mode === "display"}
                {...register("name")}
              />
            </div>
            <Select
              label="Under"
              options={undergroups}
              {...register("under")}
            />
            {errors.under && (
              <p className="text-red-600 text-sm">{errors.under.message}</p>
            )}
          </div>

          <div className="w-full mt-10 space-y-2">
            <Select
              label="Group behaves like a sub-ledger"
              options={["No", "Yes"]}
              {...register("behavesLikeSubLedger")}
            />

            <Select
              label="Nett Debit/Credit Balances for Reporting"
              options={["No", "Yes"]}
              {...register("netDebitCredit")}
            />

            <Select
              label="Used for calculation (for example: taxes, discounts)"
              options={["No", "Yes"]}
              {...register("usedForCalculation")}
            />

            <Select
              label="Method to allocate when used in purchase invoice"
              options={["Not Applicable", "Applicable"]}
              {...register("allocationMethod")}
            />
          </div>
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
    );
};
export default Groups;
