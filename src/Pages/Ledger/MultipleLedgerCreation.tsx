import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import CalclulatorArea from "../../Components/CalclulatorArea"; // Adjust path
import { useAppDispatch } from "../../store/store"; // Adjust path
// import { createLedger } from "./ledgerSlice"; // You can loop this or make a bulk action

// Types
type LedgerRow = {
  id: number;
  ledgerName: string;
  under: string; // The group
  openingBalance: string;
  drCr: "Dr" | "Cr";
};

const GroupList = [
  "All Items", // Special option to allow mixed groups
  "Bank Accounts",
  "Bank OCC A/c",
  "Bank OD A/c",
  "Branch / Divisons",
  "Capital Account",
  "Cash-in-Hand",
  "Current Assets",
  "Sundry Debtors",
  "Sundry Creditors",
  "Direct Expenses",
  "Indirect Expenses",
];

const MultipleLedgerCreation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- State ---
  const [commonUnder, setCommonUnder] = useState<string>("All Items");
  const [showTopGroupList, setShowTopGroupList] = useState(false);
  const [rows, setRows] = useState<LedgerRow[]>([
    { id: 1, ledgerName: "", under: "", openingBalance: "", drCr: "Dr" },
  ]);

  // For "Under" column in table (Row-specific lookup)
  const [activeRowSearch, setActiveRowSearch] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1); // For list navigation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.title = "Multi Ledger Creation - SN ERP";
  }, []);

  // --- Helpers ---

  // Update a specific row
  const handleRowChange = (
    id: number,
    field: keyof LedgerRow,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Add a new empty row
  const addNewRow = () => {
    const newId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 1;
    setRows((prev) => [
      ...prev,
      {
        id: newId,
        ledgerName: "",
        under: commonUnder === "All Items" ? "" : commonUnder,
        openingBalance: "",
        drCr: "Dr",
      },
    ]);
  };

  // Handle Enter Key Navigation
  const handleKeyDown = (
    e: React.KeyboardEvent,
    rowId: number,
    field: keyof LedgerRow,
    index: number
  ) => {
    // 1. If Popup is open, handle list nav
    if (activeRowSearch !== null || showTopGroupList) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => prev + 1); // Simplified for demo
      } else if (e.key === "Enter") {
        e.preventDefault();
        // Handle selection logic here if needed, or rely on Click
        if (showTopGroupList) {
          // Basic logic: Select current input val
          setShowTopGroupList(false);
        } else if (activeRowSearch !== null) {
          setActiveRowSearch(null);
        }
      }
      return;
    }

    // 2. Add Row on Enter at last column
    if (e.key === "Enter") {
      if (field === "openingBalance" || field === "drCr") {
        // If it's the last row, add new
        if (index === rows.length - 1) {
          // Check if row has data before adding new
          if (rows[index].ledgerName.trim() !== "") {
            addNewRow();
          } else {
            // If empty name and enter pressed, trigger save
            e.preventDefault();
            previouslyFocused.current = document.activeElement as HTMLElement;
            setConfirmOpen(true);
          }
        }
      }
    }
  };

  // Filter groups for the popup
  const getFilteredGroups = (searchText: string) => {
    return GroupList.filter((g) =>
      g.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // --- Final Submit ---
  const handleFinalSubmit = () => {
    // Filter out empty rows
    const validRows = rows.filter((r) => r.ledgerName.trim() !== "");

    console.log("--------------------------------");
    console.log("🚀 BULK CREATING LEDGERS");
    console.log("Common Group:", commonUnder);
    console.log("Data:", validRows);
    console.log("--------------------------------");

    // Here you would loop and dispatch createLedger for each,
    // or dispatch a 'createMultipleLedgers' action.
    /* validRows.forEach(row => {
        dispatch(createLedger({
            ledgerName: row.ledgerName,
            under: commonUnder === "All Items" ? row.under : commonUnder,
            toB: row.openingBalance + " " + row.drCr,
            ...defaultValues
        }))
    }) 
    */

    setConfirmOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen h-screen flex flex-col w-full bg-[#f2f2f2]">
      {/* Header Bar */}
      <div className="w-full pt-10 px-4 flex items-center justify-between bg-gray-300 shrink-0">
        <h1 className="capitalize text-black text-md font-semibold">
          Multi Ledger Creation
        </h1>
        <div className="flex items-center gap-3">
          <h1 className="text-muted text-sm">Ctrl + M</h1>
          <button onClick={() => navigate("/")}>
            <AiTwotoneCloseSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-2 overflow-hidden">
        {/* Top Selection: Under Group */}
        <div className="w-full bg-[#FFFFD9] border border-gray-400 p-2 mb-2 flex items-center justify-center relative">
          <label className="font-semibold mr-4 text-sm">Under Group:</label>
          <div className="relative">
            <input
              type="text"
              value={commonUnder}
              onClick={() => {
                setCommonUnder("");
                setShowTopGroupList(true);
              }}
              onChange={(e) => {
                setCommonUnder(e.target.value);
                setShowTopGroupList(true);
              }}
              className="bg-white border border-gray-400 px-2 py-1 w-64 outline-none focus:bg-yellow-100"
            />
            {/* Top Dropdown */}
            {showTopGroupList && (
              <div className="absolute top-full left-0 w-full bg-[#C5C6C7] border border-gray-500 z-50 max-h-40 overflow-y-auto">
                {getFilteredGroups(commonUnder).map((g, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                    onClick={() => {
                      setCommonUnder(g);
                      setShowTopGroupList(false);
                      // Reset rows under if changed to a specific group
                      if (g !== "All Items") {
                        setRows(rows.map((r) => ({ ...r, under: g })));
                      } else {
                        setRows(rows.map((r) => ({ ...r, under: "" })));
                      }
                    }}
                  >
                    {g}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="w-full h-full bg-white border border-gray-400 overflow-y-auto relative">
          <table className="w-full border-collapse">
            <thead className="bg-[#FFFFD9] sticky top-0 z-10 shadow-sm">
              <tr className="border-b border-gray-400">
                <th className="w-10 border-r border-gray-300 py-1">Sr.</th>
                <th className="w-[40%] text-left px-2 border-r border-gray-300">
                  Name of Ledger
                </th>
                <th className="w-[30%] text-left px-2 border-r border-gray-300">
                  Under
                </th>
                <th className="w-[20%] text-right px-2 border-r border-gray-300">
                  Opening Balance
                </th>
                <th className="w-[10%] text-center px-2">Dr/Cr</th>
              </tr>
            </thead>
            <tbody className="bg-[#FFFFD9]">
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-300 hover:bg-yellow-100"
                >
                  {/* Sr No */}
                  <td className="text-center text-sm py-1 border-r border-gray-300">
                    {index + 1}
                  </td>

                  {/* Name */}
                  <td className="border-r border-gray-300 p-0">
                    <input
                      type="text"
                      className="w-full px-2 py-1 bg-transparent outline-none focus:bg-white"
                      value={row.ledgerName}
                      onChange={(e) =>
                        handleRowChange(row.id, "ledgerName", e.target.value)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, row.id, "ledgerName", index)
                      }
                      placeholder={
                        index === rows.length - 1 ? "End of List" : ""
                      }
                    />
                  </td>

                  {/* Under (Group) */}
                  <td className="border-r border-gray-300 p-0 relative">
                    {commonUnder === "All Items" ? (
                      <>
                        <input
                          type="text"
                          className="w-full px-2 py-1 bg-transparent outline-none focus:bg-white"
                          value={row.under}
                          onFocus={() => setActiveRowSearch(row.id)}
                          onChange={(e) =>
                            handleRowChange(row.id, "under", e.target.value)
                          }
                        />
                        {/* Row Specific Dropdown */}
                        {activeRowSearch === row.id && (
                          <div className="absolute top-full left-0 w-full bg-[#C5C6C7] border border-gray-500 z-50 max-h-40 overflow-y-auto">
                            {getFilteredGroups(row.under).map((g, i) => (
                              <div
                                key={i}
                                className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer text-sm"
                                onMouseDown={(e) => {
                                  e.preventDefault(); // Prevent blur
                                  handleRowChange(row.id, "under", g);
                                  setActiveRowSearch(null);
                                }}
                              >
                                {g}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="px-2 text-gray-500 italic text-sm">
                        {commonUnder}
                      </span>
                    )}
                  </td>

                  {/* Opening Balance */}
                  <td className="border-r border-gray-300 p-0">
                    <input
                      type="number"
                      className="w-full px-2 py-1 bg-transparent outline-none focus:bg-white text-right"
                      value={row.openingBalance}
                      onChange={(e) =>
                        handleRowChange(
                          row.id,
                          "openingBalance",
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, row.id, "openingBalance", index)
                      }
                    />
                  </td>

                  {/* Dr/Cr */}
                  <td className="p-0">
                    <select
                      className="w-full px-1 py-1 bg-transparent outline-none focus:bg-white text-center appearance-none"
                      value={row.drCr}
                      onChange={(e) =>
                        handleRowChange(
                          row.id,
                          "drCr",
                          e.target.value as "Dr" | "Cr"
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(e, row.id, "drCr", index)}
                    >
                      <option value="Dr">Dr</option>
                      <option value="Cr">Cr</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Calculator Area */}
      <CalclulatorArea />

      {/* Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div className="w-[250px] bg-[#FFFFD9] border-2 border-black p-6 shadow-2xl">
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

export default MultipleLedgerCreation;
