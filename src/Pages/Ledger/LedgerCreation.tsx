import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import Select from "../../Components/Select";
import Field from "../../Components/Field";

const LedgerCreation = () => {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [under, setunder] = useState<string>("");
  const [showGroupList, setGroupList] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const GroupList = [
    "Bank Accounts",
    "Bank OCC A/c",
    "Bank OD A/c",
    "Branch / Divisons",
    "Capital Account",
    "Cash-in-Hand",
    "Current Assets",
  ];

  const FilterGroupList = GroupList.filter((item) =>
    item.toLowerCase().includes(under.toLowerCase())
  );

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

  const handleFinalSubmit = () => {
    console.log("Form Submitted Successfully");
    setConfirmOpen(false);
    navigate("/");
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

        if (showGroupList && activeIndex >= 0) {
          return;
        }

        if (active?.tagName !== "TEXTAREA") {
          e.preventDefault();
          previouslyFocused.current = active;
          setConfirmOpen(true);
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [confirmOpen, showGroupList, activeIndex, navigate]);

  return (
    <div className="min-h-screen h-screen flex flex-col w-full relative">
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

      <div className="w-full pl-5 flex justify-between flex-1 h-full overflow-hidden">
        <div className="py-3 w-full h-full ">
          <form
            ref={formRef}
            onSubmit={(e) => e.preventDefault()}
            className="h-full"
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <Field label="Name" type="text" className="w-full" />
                <Field label="Alias" type="text" className="w-full" />
              </div>
              <div className="flex flex-col items-center justify-center border-gray-400 border px-4">
                <label className="underline text-sm">
                  Total Opening Balance
                </label>
                <input
                  type="text"
                  value={"200.00$"}
                  readOnly
                  className="bg-transparent text-center h-20 text-xl outline-none"
                />
              </div>
            </div>

            <div className="w-full flex border-gray-400 border-t py-5 h-full">
              <div className="w-full border-gray-400 border-r px-4 ">
                <Field
                  type="search"
                  label="Under"
                  name="under"
                  value={under}
                  onFocus={() => {
                    setGroupList(true);
                    setActiveIndex(-1);
                  }}
                  onChange={(e) => {
                    setunder(e.target.value);
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
                      e.stopPropagation(); // Stop the global Enter listener from opening the modal
                      setunder(FilterGroupList[activeIndex]);
                      setGroupList(false);
                    }
                    if (e.key === "Escape") {
                      setGroupList(false);
                    }
                  }}
                />
                <Select
                  label="Inventory values are affected"
                  options={["No", "Yes"]}
                  className="items-start w-full justify-start mt-4"
                />
              </div>

              <div className="w-full px-4 py-2">
                <h2 className="text-center mb-5 font-semibold">
                  Mailing details
                </h2>
                <Field label="Name" type="text" />
                <Field label="Address" type="text" />
                <div className="mt-4">
                  <Select
                    label="Country"
                    options={["Pakistan"]}
                    className="flex justify-between w-full"
                  />
                </div>
                <div className="w-full mt-4">
                  <Select
                    label="Provide bank Details"
                    options={["No", "Yes"]}
                    className="items-start w-full"
                  />
                </div>
                <div className="w-full text-center mt-8 mb-4">
                  <h2 className="underline font-semibold">
                    Tax Registration Details
                  </h2>
                </div>
                <Field type="text" label="PAN/IT NO." />
              </div>
            </div>
          </form>
        </div>

        {showGroupList && (
          <div className="w-full max-w-sm bg-[#C5C6C7] border border-gray-500 h-full overflow-y-auto">
            <h2 className="text-center font-serif text-white text-xl py-1 bg-[#176EE8] w-full">
              List of Groups
            </h2>
            <ul>
              {FilterGroupList.map((item, index) => (
                <li
                  key={index}
                  className={`px-2 py-1 cursor-pointer ${
                    index === activeIndex
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-400"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    setunder(item);
                    setGroupList(false);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
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
