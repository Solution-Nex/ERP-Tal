import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import type { FormChangeEvent, FormDataType } from "./Types";
import Select from "../../Components/common/Select";
import Field from "../../Components/common/Field";
// Import the new component
import GroupListSidebar from "./GroupListSidebar";

const LedgerCreation = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [under, setunder] = useState<string>("");
  const [showGroupList, setGroupList] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormDataType | "under", string>>
  >({});
  const [FormData, setFormData] = useState<FormDataType>({
    ledgerName: "",
    ledgerAlias: "",
    toB: "200 $",
    acholderName: "",
    acNumber: "",
    ifsCode: "",
    bankName: "Not Applicable",
    bankBranch: "",
    checkBooks: "No",
    checkPrintConfig: "No",
    inventoryValue: "No",
    ledgerType: "Not Applicable",
    mailName: "",
    mailAddress: "",
    mailCountry: "Pakistan",
    mailState: "Punjab",
    mailPinCode: "",
    mailBankDetails: "No",
    panItNO: "",
  });

  // --- DATA ---
  const GroupList = [
    "Bank Accounts",
    "Bank OCC A/c",
    "Bank OD A/c",
    "Branch / Divisons",
    "Capital Account",
    "Cash-in-Hand",
    "Current Assets",
  ];

  // Filtering happens here so arrow keys know the length
  const FilterGroupList = GroupList.filter((item) =>
    item.toLowerCase().includes(under.toLowerCase())
  );

  // --- VALIDATION ---
  const Validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!FormData.ledgerName.trim()) {
      newErrors.ledgerName = "Ledger Name is Required";
    }
    if (!under.trim()) {
      newErrors.under = "Please Select Group";
    }
    if (!FormData.mailName.trim()) {
      newErrors.mailName = "Mailing Name is required";
    }
    if (!FormData.mailAddress.trim()) {
      newErrors.mailAddress = "Mail address Is required";
    }
    if (!FormData.mailState.trim()) {
      newErrors.mailState = "Mail State Is required";
    }
    if (!FormData.mailPinCode.trim()) {
      newErrors.mailPinCode = "Pin Code Is required";
    }
    if (!FormData.panItNO.trim()) {
      newErrors.panItNO = "PAN/IT/NO Is required";
    }

    if (under === "Bank Accounts") {
      if (!FormData.acholderName.trim()) {
        newErrors.acholderName = "Account Name is Required";
      }
      if (!FormData.bankBranch.trim()) {
        newErrors.bankBranch = "Bank branch is required";
      }
      if (!FormData.acNumber.trim()) {
        newErrors.acNumber = "Account Number is required";
      }

      if (!FormData.ifsCode.trim()) {
        newErrors.ifsCode = "IFS Code is required";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      focusFirstError(newErrors);
      return false;
    }

    return true;
  };

  const focusFirstError = (errors: any) => {
    const form = formRef.current;
    if (!form) return;

    const firstErrorFieldName = Object.keys(errors)[0];
    if (!firstErrorFieldName) return;

    const field = form.querySelector(
      `[name="${firstErrorFieldName}"]`
    ) as HTMLElement | null;

    field?.focus();
  };

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper to move focus between inputs (Tally style)
  const moveFocus = (delta: number) => {
    const form = formRef.current;
    if (!form) return;
    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>(
        "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])"
      )
    ).filter((el) => el.tabIndex !== -1);

    const active = document.activeElement as HTMLElement | null;
    const idx = focusable.findIndex((el) => el === active);
    let next = 0;
    if (idx === -1) next = delta > 0 ? 0 : focusable.length - 1;
    else next = (idx + delta + focusable.length) % focusable.length;
    focusable[next].focus();
  };

  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!Validate()) return;
    console.log("Final Data:", { ...FormData, under });

    setConfirmOpen(false);
    navigate("/");
  };

  const handleAskConfirm = () => {
    if (!Validate()) return;
    setConfirmOpen(true);
  };

  // --- SIDEBAR HANDLERS ---
  const handleGroupSelect = (item: string) => {
    setunder(item);
    setGroupList(false);
  };

  useEffect(() => {
    document.title = "Create Ledger - SN ERP";

    const handleKey = (e: KeyboardEvent) => {
      // Logic when Modal is Open
      if (confirmOpen) {
        if (e.key === "Escape" || e.key.toLowerCase() === "n") {
          e.preventDefault();
          setConfirmOpen(false);
          previouslyFocused.current?.focus();
        }
        if (e.key === "Enter" || e.key.toLowerCase() === "y") {
          e.preventDefault();
          handleFinalSubmit();
        }
        return;
      }

      // Shortcut to exit
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/");
      }

      // Arrow Key Navigation
      if (e.key === "ArrowDown" && !showGroupList) {
        e.preventDefault();
        moveFocus(1);
      }
      if (e.key === "ArrowUp" && !showGroupList) {
        e.preventDefault();
        moveFocus(-1);
      }

      // Enter Key Logic
      if (e.key === "Enter") {
        const active = document.activeElement as HTMLElement | null;

        // Prevent default submit unless it's a textarea
        if (active?.tagName !== "TEXTAREA") {
          e.preventDefault();
        }

        // If Group List is open and we have an active selection
        if (showGroupList && activeIndex >= 0) {
          // Logic handled in Input onKeyDown, but if global catches it:
          return;
        }

        // If simple enter to submit form
        handleAskConfirm();
        previouslyFocused.current = active;
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen, showGroupList, activeIndex, navigate, FormData]); // Added FormData dependency

  return (
    <div className="min-h-screen h-screen flex flex-col w-full ">
      <div className="w-full pt-10 px-4 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md font-semibold">
            Ledger Creation
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-muted text-sm">Ctrl + M</h1>
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Close"
          >
            <AiTwotoneCloseSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full pl-5 flex justify-between flex-1 h-full overflow-hidden ">
        <div className="py-3 w-full h-full ">
          <form ref={formRef} onSubmit={handleFinalSubmit} className="h-full">
            <div className="flex justify-between">
              <div className="flex flex-col">
                <Field
                  label="Name"
                  name="ledgerName"
                  type="text"
                  className="w-full"
                  value={FormData.ledgerName}
                  onChange={handleChange}
                />
                <Field
                  label="Alias"
                  name="ledgerAlias"
                  type="text"
                  className="w-full"
                  value={FormData.ledgerAlias}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col items-center justify-center border-gray-400 border px-4">
                <label className="underline text-sm">
                  Total Opening Balance
                </label>
                <input
                  type="text"
                  value={FormData.toB}
                  onChange={handleChange}
                  name="toB"
                  readOnly
                  className="bg-transparent text-center h-20 text-xl outline-none"
                />
              </div>
            </div>

            <div className="w-full flex border-gray-400 border-t h-full">
              <div className="w-full border-gray-400 border-r">
                <Field
                  type="search"
                  label="Under"
                  name="under"
                  value={under}
                  autoComplete="off"
                  onFocus={() => {
                    setGroupList(true);
                    setActiveIndex(-1);
                  }}
                  onBlur={() => {
                    setGroupList(false);
                  }}
                  onChange={(e) => {
                    setunder(e.target.value);
                    if (e.target.value === "") {
                      setGroupList(true);
                    }
                    setActiveIndex(-1);
                  }}
                  onKeyDown={(e) => {
                    if (!showGroupList) return;

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev < FilterGroupList.length - 1 ? prev + 1 : 0
                      );
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : FilterGroupList.length - 1
                      );
                    }
                    if (e.key === "Enter" && activeIndex >= 0) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleGroupSelect(FilterGroupList[activeIndex]);
                    }
                    if (e.key === "Escape") {
                      setGroupList(false);
                    }
                  }}
                />

                {under === "Bank Accounts" ? (
                  <div className="mt-10">
                    <h3 className="underline font-semibold ">
                      Bank Account Details
                    </h3>
                    <Field
                      label="A/c holder's name"
                      type="text"
                      name="acholderName"
                      className="mt-2"
                      value={FormData.acholderName}
                      onChange={handleChange}
                    />
                    <Field
                      label="A/c no."
                      type="text"
                      name="acNumber"
                      value={FormData.acNumber}
                      onChange={handleChange}
                    />
                    <Field
                      label="IFS Code"
                      type="text"
                      name="ifsCode"
                      value={FormData.ifsCode}
                      onChange={handleChange}
                    />

                    <Select
                      label="Bank Name"
                      options={["Not Applicable", "HBL", "NBP"]}
                      name="bankName"
                      value={FormData.bankName}
                      onChange={handleChange}
                    />
                    <Field
                      label="Branch"
                      type="text"
                      name="bankBranch"
                      value={FormData.bankBranch}
                      onChange={handleChange}
                    />
                    <h3 className="underline font-semibold mt-5">
                      Bank Configuration
                    </h3>
                    <Select
                      className="mt-2"
                      label="Set cheque books ?"
                      options={["No"]}
                      name="checkBooks"
                      value={FormData.checkBooks}
                      onChange={handleChange}
                    />
                    <Select
                      className="mt-2"
                      label="Set cheque printing configuration ?"
                      options={["No"]}
                      name="checkPrintConfig"
                      value={FormData.checkPrintConfig}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <>
                    <Select
                      label="Inventory values are affected ?"
                      options={["No", "Yes"]}
                      className="w-full mt-2"
                      name="inventoryValue"
                      value={FormData.inventoryValue}
                      onChange={handleChange}
                    />
                    <Select
                      label="Ledger Type ?"
                      options={["Not Applicable", "Invoice Rounding"]}
                      className="w-full mt-2"
                      name="ledgerType"
                      value={FormData.ledgerType}
                      onChange={handleChange}
                    />
                  </>
                )}
              </div>

              <div className="w-full ml-3">
                <h2 className="text-center mb-4 font-sm">Mailing details</h2>
                <Field
                  label="Name"
                  type="text"
                  name="mailName"
                  value={FormData.mailName}
                  autoComplete="false"
                  onChange={handleChange}
                />
                <Field
                  label="Address"
                  type="text"
                  autoComplete="false"
                  name="mailAddress"
                  value={FormData.mailAddress}
                  onChange={handleChange}
                />
                <div>
                  <Select
                    label="Country"
                    options={["Pakistan"]}
                    className="flex justify-between w-full"
                    name="mailCountry"
                    value={FormData.mailCountry}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Select
                    label="State"
                    options={["Punjab"]}
                    className="flex justify-between w-full"
                    name="mailState"
                    onChange={handleChange}
                    value={FormData.mailState}
                  />
                </div>
                <div>
                  <Field
                    label="Pin Code"
                    type="text"
                    className="flex justify-between w-full"
                    name="mailPinCode"
                    value={FormData.mailPinCode}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full">
                  <Select
                    label="Provide bank Details"
                    options={["No", "Yes"]}
                    className="items-start w-full"
                    name="mailBankDetails"
                    onChange={handleChange}
                    value={FormData.mailBankDetails}
                  />
                </div>
                <div className="w-full text-center my-4">
                  <h2 className="underline font-semibold">
                    Tax Registration Details
                  </h2>
                </div>
                <Field
                  type="text"
                  label="PAN/IT NO."
                  name="panItNO"
                  onChange={handleChange}
                  autoComplete="false"
                  value={FormData.panItNO}
                />
              </div>
            </div>
          </form>
        </div>

        {/* --- HERE IS THE NEW COMPONENT --- */}
        <GroupListSidebar
          isOpen={showGroupList}
          filteredList={FilterGroupList}
          activeIndex={activeIndex}
          onSelect={handleGroupSelect}
          onHover={setActiveIndex}
        />
      </div>

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="w-[250px] bg-white shadow-2xl border-2 border-blue-600 p-6">
            <h2 className="text-lg font-bold mb-4 text-center">Accept?</h2>
            <div className="flex justify-around">
              <button
                className="px-6 py-1 bg-gray-200 border border-gray-400 hover:bg-gray-300"
                onClick={() => {
                  setConfirmOpen(false);
                  previouslyFocused.current?.focus();
                }}
              >
                No
              </button>
              <button
                className="px-6 py-1 bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleFinalSubmit}
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

export default LedgerCreation;
