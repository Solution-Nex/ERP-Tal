import { useState, useEffect, useRef } from "react";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Select from "../../../Components/common/Select";
import { groupSchema, type GroupFormValues } from "./multiplegroupschema";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { createMultipleGroups, updateMultipleGroups } from "../slice";
import type { Group, GroupFromBackend } from "../types";

// interface GroupRow {
//   id: number;
//   name: string;
//   under: string;
// }

const MultiGroupCreation = () => {
  const dispatch = useAppDispatch();
  const { loading: groupsLoading, error: groupsError } = useAppSelector(
    (state) => state.groups
  );
  const selectedCompany = useAppSelector(
    (state) => state.company.selectedCompany
  );

  const location = useLocation();
  const navigate = useNavigate();
  const yesButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const fieldRefs = useRef<(HTMLInputElement | HTMLSelectElement | null)[]>([]);
  const focusedIndex = useRef(0);

  {
    /*for display group */
  }
  const mode = location.state?.mode ?? "create-multiple";
  const group = location.state?.group ?? "";

  const undergroups = ["Bank Account", "Capital Account", "Asset details"];

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [activeRow, setActiveRow] = useState<number>(4);

  const [rows, setRows] = useState<Group[]>([
    {
      id: "1",
      name: "",
      alias: "",
      under: "",
      behavesLikeSubLedger: "No",
      netDebitCredit: "Yes",
      usedForCalculation: "Yes",
      allocationMethod: "None",
      companyId: "ideeee",
    },
  ]);

  const isFormField = (el: HTMLElement | null) => {
    if (!el) return false;
    return (
      el.tagName === "INPUT" ||
      el.tagName === "SELECT" ||
      el.tagName === "TEXTAREA"
    );
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
        if (e.key.toLowerCase() === "y" || e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          submitFromModal();
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
        if (mode === "create-multiple") {
          navigate("/select-group");
        } else {
          navigate("/select-group");
        }
        return;
      }

      // if (formRef.current && formRef.current.contains(document.activeElement)) {
      const active = document.activeElement as HTMLElement | null;

      // Ignore inside select dropdown open
      if (active?.tagName === "SELECT") return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = focusedIndex.current + 1;

        fieldRefs.current[next]?.focus();
        focusedIndex.current = next;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = focusedIndex.current - 1;

        fieldRefs.current[prev]?.focus();
        focusedIndex.current = prev;
      }

      if (e.key === "Enter") {
        const active = document.activeElement as HTMLElement | null;
        const inField = isFormField(active);
        // If typing inside input/select → do NOT open confirm
        if (inField) return;

        e.preventDefault();
        openConfirmModal();
      }

      // Enter opens confirmation modal instead of submitting directly
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen, navigate]);

  const {
    register,
    watch,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      under: "",
      groups: [{ name: "", under: "" }],
    },
  });

  useEffect(() => {
    setValue(
      "groups",
      rows.map((r) => ({
        name: r.name,
        under: r.under,
        id: String(r.id),
        alias: r.alias,
        behavesLikeSubLedger: r.behavesLikeSubLedger,
        netDebitCredit: r.netDebitCredit,
        usedForCalculation: r.usedForCalculation,
        allocationMethod: r.allocationMethod,
        companyId: selectedCompany?._id || "",
      }))
    );
  }, [rows, setValue, selectedCompany?._id]);

  const selectedUnder = watch("under");
  useEffect(() => {
    if (group) {
      setValue(`groups.0.name`, group);
    }
  }, [group, setValue]);

//   const selectedUnder = watch("under");

  useEffect(() => {
    if (!selectedUnder) return;

    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        under: selectedUnder,
      }))
    );
  }, [selectedUnder]);

  const submitFromModal = () => {
    setConfirmOpen(false);
    previouslyFocused.current?.blur();
    // programmatically run react-hook-form submit
    handleSubmit(onSubmit)();
  };

  const openConfirmModal = () => {
    // Get current form values
    const formData = getValues();
    const nonEmptyGroups = (formData.groups || []).filter((g) => g && g.name && g.name.trim());

    console.log("📋 Form Data:", formData);
    console.log("📊 Non-empty groups:", nonEmptyGroups.length);

    if (nonEmptyGroups.length === 0) {
      alert("Please add at least one group before submitting.");
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement;
    setConfirmOpen(true);
  };

  const onSubmit = async (data: GroupFormValues) => {
    try {
      const groupsToSubmit = data.groups.map((g) => ({
        name: g.name,
        under: g.under,
        behavesLikeSubLedger: "No" as const,
        netDebitCredit: "No" as const,
        usedForCalculation: "No" as const,
        allocationMethod: "",
        companyId: selectedCompany?._id,
      }));

      console.log("═══════════════════════════════════════");
      console.log("🎯 MULTIPLE GROUP SUBMISSION");
      console.log("═══════════════════════════════════════");
      console.log("Mode:", mode);
      console.log("Company:", selectedCompany?.name);
      console.log("Groups to submit:", groupsToSubmit);
      console.log("═══════════════════════════════════════");

      if (mode === "create-multiple") {
        console.log("📝 CREATING MULTIPLE GROUPS...");
        await dispatch(createMultipleGroups(groupsToSubmit)).unwrap();
        console.log("✓ GROUPS CREATED SUCCESSFULLY");
        navigate("/groups");
      } else if (mode === "alter-multiple") {
        console.log("✏️ UPDATING MULTIPLE GROUPS...");
        // For update, we need the full GroupFromBackend with _id
        // This would typically come from location.state or loaded data
        await dispatch(
          updateMultipleGroups(groupsToSubmit as GroupFromBackend[])
        ).unwrap();
        console.log("✓ GROUPS UPDATED SUCCESSFULLY");
        navigate("/groups");
      }
    } catch (error) {
      console.error("❌ SUBMISSION FAILED:", error);
    }
  };

  const { ref: rhfRef, ...underField } = register("under");

  return (
    <div className="h-screen bg-[#c5c6c7] text-sm">
      {/* Header */}
      <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md  font-semibold">
            {mode === "create"
              ? "Multiple group creation"
              : mode === "display"
              ? "Display Groups"
              : mode === "alter"
              ? "Update Values of groups"
              : "Gateway of Tally"}
          </h1>
        </div>
        <h1 className="capitalize text-black text-md  font-semibold">
          {selectedCompany && selectedCompany.name}
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

      {/* SUB HEADER */}
      <div className="px-3 my-4">
        <Select
          label="Under Group"
          options={undergroups}
          {...underField}
          ref={(el) => {
            rhfRef(el);
            fieldRefs.current[0] = el;
          }}
        />
        {errors.under && (
          <p className="text-red-600 text-sm">{errors.under.message}</p>
        )}
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-[60px_1fr_200px] border-y border-black px-3 font-semibold">
        <div className="border-r border-black py-1 px-2">S.No.</div>
        <div className="border-r border-black py-1 px-2">Name of Group</div>
        <div className="py-1 px-2">Under</div>
      </div>

      {/* TABLE BODY */}
      {rows.map((row, index) => (
        <div
          key={row.id}
          className={`grid grid-cols-[60px_1fr_200px] px-3 py-1 ${
            activeRow === index ? "bg-[#b7d7b0]" : ""
          }`}
          onClick={() => setActiveRow(index)}
        >
          <div>{index + 1}.</div>

          <input
            {...register(`groups.${index}.name` as const)}
            ref={(el) => {
              fieldRefs.current[index + 1] = el;
            }}
            className={`bg-transparent outline-none max-w-52 ${
              activeRow === index ? "border border-black px-1" : ""
            }`}
            readOnly={mode === "display-multiple"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                if (index === rows.length - 1) {
                  setRows((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      name: "",
                      alias: "",
                      under: "",
                      behavesLikeSubLedger: "No",
                      netDebitCredit: "Yes",
                      usedForCalculation: "Yes",
                      allocationMethod: "None",
                      companyId: "ideeee",
                    },
                  ]);
                }

                setActiveRow(index + 1);
                fieldRefs.current[index + 2]?.focus();
              }
            }}
          />
          {errors.groups?.[index]?.name && (
            <p className="text-red-600 text-xs">
              {errors.groups[index]?.name?.message}
            </p>
          )}

          <div>{row.under}</div>
        </div>
      ))}

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
            {groupsError && (
              <p className="text-red-600 text-sm mb-3">{groupsError}</p>
            )}

            <div className="flex justify-between gap-3">
              <button
                type="button"
                className="px-4 py-2  bg-gray-200 hover:bg-gray-300"
                disabled={groupsLoading}
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
                className="px-4 py-2  bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={groupsLoading}
                onClick={submitFromModal}
              >
                {groupsLoading ? "Processing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiGroupCreation;
