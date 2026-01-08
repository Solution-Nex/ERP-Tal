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

  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement>(null);
  const fieldRefs = useRef<(HTMLInputElement | HTMLSelectElement)[]>([]);

  const mode = location.state?.mode ?? "create-multiple";
  const group = location.state?.group ?? "";

  const isDisplayMode = mode === "display-multiple";
  const isAlterMode = mode === "alter-multiple";
//   const isCreateMode = mode === "create-multiple";


  const undergroups = ["Bank Account", "Capital Account", "Asset details"];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(0);

//   const [rows, setRows] = useState<Group[]>([
//     {
//       id: "1",
//       name: "",
//       alias: "",
//       under: "",
//       behavesLikeSubLedger: "No",
//       netDebitCredit: "Yes",
//       usedForCalculation: "Yes",
//       allocationMethod: "None",
//       companyId: "ideeee",
//     },
//   ]);

const [rows, setRows] = useState<Group[]>(() => {
  if ((isDisplayMode || isAlterMode) && group) {
    return [
      {
        id: "1",
        name: group.name,
        alias: group.alias,
        under: group.under,
        behavesLikeSubLedger: group.behavesLikeSubLedger,
        netDebitCredit: group.netDebitCredit,
        usedForCalculation: group.usedForCalculation,
        allocationMethod: "None",
        companyId: selectedCompany?._id || "",
      },
    ];
  }

  return [
    {
      id: "1",
      name: "",
      alias: "",
      under: "",
      behavesLikeSubLedger: "No",
      netDebitCredit: "Yes",
      usedForCalculation: "Yes",
      allocationMethod: "None",
      companyId: selectedCompany?._id || "",
    },
  ];
});
  

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

  const selectedUnder = watch("under");

  /* ---------- sync rows -> RHF ---------- */
  useEffect(() => {
    setValue(
      "groups",
      rows.map((r) => ({
        id: String(r.id),
        name: r.name,
        under: r.under,
        alias: r.alias,
        behavesLikeSubLedger: r.behavesLikeSubLedger,
        netDebitCredit: r.netDebitCredit,
        usedForCalculation: r.usedForCalculation,
        allocationMethod: r.allocationMethod,
        companyId: selectedCompany?._id || "",
      }))
    );
  }, [rows, setValue, selectedCompany?._id]);

  /* ---------- set under for all existing rows ---------- */
  useEffect(() => {
    if (!selectedUnder) return;

    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        under: selectedUnder,
      }))
    );
  }, [selectedUnder]);

  /* ---------- prefill first group ---------- */
  useEffect(() => {
    if (group) {
      setValue("groups.0.name", group);
    }
  }, [group, setValue]);

  /* ---------- keyboard handling ---------- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (confirmOpen) {
        if (isDisplayMode) return;

        if (e.key === "Escape") {
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
        }
        if (e.key.toLowerCase() === "y" || e.key === "Enter") {
          e.preventDefault();
          submitFromModal();
        }
        if (e.key.toLowerCase() === "n") {
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
        }
        return;
      }

      if (e.key === "Enter") {
        const active = document.activeElement as HTMLElement | null;
        if (
          active?.tagName === "INPUT" ||
          active?.tagName === "SELECT" ||
          active?.tagName === "TEXTAREA"
        ) {
          return;
        }
        e.preventDefault();
        openConfirmModal();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen]);

  /* ---------- confirm modal ---------- */
  const openConfirmModal = () => {
    const formData = getValues();
    const nonEmptyGroups = (formData.groups || []).filter((g) => g && g.name && g.name.trim());

    if (nonEmptyGroups.length === 0) {
      alert("Please add at least one group before submitting.");
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement;
    setConfirmOpen(true);
  };

  const submitFromModal = () => {
    setConfirmOpen(false);
    handleSubmit(onSubmit)();
  };

  /* ---------- submit ---------- */
  const onSubmit = async (data: GroupFormValues) => {
    try {
      const groupsToSubmit = data.groups
        .filter((g) => g.name && g.name.trim())
        .map((g) => ({
          name: g.name,
          under: g.under,
          behavesLikeSubLedger: "No" as const,
          netDebitCredit: "No" as const,
          usedForCalculation: "No" as const,
          allocationMethod: "",
          companyId: selectedCompany?._id,
        }));

      if (mode === "create-multiple") {
        await dispatch(createMultipleGroups(groupsToSubmit)).unwrap();
      } else {
        await dispatch(
          updateMultipleGroups(groupsToSubmit as GroupFromBackend[])
        ).unwrap();
      }

      navigate("/groups");
    } catch (err) {
      console.error(err);
    }
  };

  const { ref: rhfRef, ...underField } = register("under");

  return (
    <div className="h-screen bg-[#c5c6c7] text-sm">
      {/* Header */}
      <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
        <h1 className="font-semibold">Multiple Group Creation</h1>
        <h1 className="font-semibold">{selectedCompany?.name}</h1>
        <AiTwotoneCloseSquare
          className="w-5 h-5 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Under Group */}
      <div className="px-3 my-4">
        {/* <Select
          label="Under Group"
          options={undergroups}
          {...underField}
          ref={(el) => {
            rhfRef(el);
            if (el) fieldRefs.current[0] = el;
          }}
        /> */}
        <Select
          label="Under Group"
          options={undergroups}
          disabled={isDisplayMode}
          {...underField}
          ref={(el) => {
            rhfRef(el);
            if (el) fieldRefs.current[0] = el;
          }}
        />
        {errors.under && (
          <p className="text-red-600 text-sm">{errors.under.message}</p>
        )}
      </div>

      {/* Table */}
      <div className="grid grid-cols-[60px_1fr_200px] border-y px-3 font-semibold">
        <div>S.No.</div>
        <div>Name of Group</div>
        <div>Under</div>
      </div>

      {rows.map((row, index) => (
        <div
          key={row.id}
          className={`grid grid-cols-[60px_1fr_200px] px-3 py-1 ${
            activeRow === index ? "bg-[#b7d7b0]" : ""
          }`}
          onClick={() => setActiveRow(index)}
        >
          <div>{index + 1}.</div>

          {/* <input
            {...register(`groups.${index}.name` as const)}
            ref={(el) => {
              if (el) fieldRefs.current[index + 1] = el;
            }}
            className="bg-transparent outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                if (index === rows.length - 1) {
                  setRows((prev) => [
                    ...prev,
                    {
                      id: String(prev.length + 1),
                      name: "",
                      alias: "",
                      under: selectedUnder || "",
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
          /> */}

          {/* <input
            {...register(`groups.${index}.name` as const)}
            value={row.name}
            onChange={(e) => {
              const value = e.target.value;
              setRows((prev) =>
                prev.map((r, i) => (i === index ? { ...r, name: value } : r))
              );
            }}
            ref={(el) => {
              if (el) fieldRefs.current[index + 1] = el;
            }}
            className="bg-transparent outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                if (index === rows.length - 1) {
                  setRows((prev) => [
                    ...prev,
                    {
                      id: String(prev.length + 1),
                      name: "",
                      alias: "",
                      under: selectedUnder || "",
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
          /> */}

          <input
            {...register(`groups.${index}.name` as const)}
            value={row.name}
            readOnly={isDisplayMode}
            onChange={(e) => {
              if (isDisplayMode) return;

              const value = e.target.value;
              setRows((prev) =>
                prev.map((r, i) => (i === index ? { ...r, name: value } : r))
              );
            }}
            ref={(el) => {
              if (el) fieldRefs.current[index + 1] = el;
            }}
            className={`bg-transparent outline-none ${
              isDisplayMode ? "cursor-not-allowed opacity-70" : ""
            }`}
            onKeyDown={(e) => {
              if (isDisplayMode) return;

              if (e.key === "Enter") {
                e.preventDefault();

                if (index === rows.length - 1) {
                  setRows((prev) => [
                    ...prev,
                    {
                      id: String(prev.length + 1),
                      name: "",
                      alias: "",
                      under: selectedUnder || "",
                      behavesLikeSubLedger: "No",
                      netDebitCredit: "Yes",
                      usedForCalculation: "Yes",
                      allocationMethod: "None",
                      companyId: selectedCompany?._id || "",
                    },
                  ]);
                }

                setActiveRow(index + 1);
                fieldRefs.current[index + 2]?.focus();
              }
            }}
          />

          <div>{row.under}</div>
        </div>
      ))}

      {/* Confirm Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 w-[200px]">
            <h2 className="font-semibold mb-3">Confirm Submit</h2>
            {groupsError && (
              <p className="text-red-600 text-sm">{groupsError}</p>
            )}
            <div className="flex justify-between">
              <button onClick={() => setConfirmOpen(false)}>No</button>
              <button
                ref={yesButtonRef}
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
