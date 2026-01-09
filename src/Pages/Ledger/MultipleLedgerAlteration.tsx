import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import CalclulatorArea from "../../Components/CalclulatorArea"; // Adjust path
import { useAppDispatch } from "../../store/store"; // Adjust path
// import { updateMultipleLedgers } from "./ledgerSlice"; // You would create this action

// Types
type LedgerRow = {
  id: string | number; // String for backend IDs, number for new rows
  ledgerName: string;
  under: string;
  openingBalance: string;
  drCr: "Dr" | "Cr";
  isNew?: boolean; // Track if it's an existing ledger or a new one added during alter
};

// Dummy Data Database (Simulating Backend)
const ALL_LEDGERS_DB = [
  {
    id: "101",
    ledgerName: "HBL Bank",
    under: "Bank Accounts",
    openingBalance: "50000",
    drCr: "Dr",
  },
  {
    id: "102",
    ledgerName: "Meezan Bank",
    under: "Bank Accounts",
    openingBalance: "120000",
    drCr: "Dr",
  },
  {
    id: "103",
    ledgerName: "Ali Traders",
    under: "Sundry Debtors",
    openingBalance: "5000",
    drCr: "Dr",
  },
  {
    id: "104",
    ledgerName: "Office Rent",
    under: "Indirect Expenses",
    openingBalance: "0",
    drCr: "Dr",
  },
];

const GroupList = [
  "All Items",
  "Bank Accounts",
  "Sundry Debtors",
  "Indirect Expenses",
  // ... add others
];

const MultipleLedgerAlteration = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- State ---
  const [selectedGroup, setSelectedGroup] = useState<string>("All Items");
  const [showTopGroupList, setShowTopGroupList] = useState(false);

  // The rows displayed in the table
  const [rows, setRows] = useState<LedgerRow[]>([]);

  // UI State
  const [activeRowSearch, setActiveRowSearch] = useState<
    number | string | null
  >(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.title = "Multi Ledger Alteration - SN ERP";
    fetchLedgersForGroup("All Items"); // Load all by default
  }, []);

  // --- Logic to Fetch Ledgers based on Group ---
  const fetchLedgersForGroup = (group: string) => {
    let filtered = [];
    if (group === "All Items") {
      filtered = ALL_LEDGERS_DB;
    } else {
      filtered = ALL_LEDGERS_DB.filter((l) => l.under === group);
    }

    // Map to state format
    const mappedRows: LedgerRow[] = filtered.map((l) => ({
      id: l.id,
      ledgerName: l.ledgerName,
      under: l.under,
      openingBalance: l.openingBalance,
      drCr: l.drCr as "Dr" | "Cr",
      isNew: false,
    }));

    setRows(mappedRows);
  };

  // --- Update Table Data ---
  const handleRowChange = (
    id: string | number,
    field: keyof LedgerRow,
    value: string
  ) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // --- Navigation & Adding Rows ---
  const handleKeyDown = (
    e: React.KeyboardEvent,
    index: number,
    field: keyof LedgerRow
  ) => {
    // 1. Dropdown Navigation (Simplified)
    if (showTopGroupList || activeRowSearch !== null) {
      if (e.key === "Enter") {
        e.preventDefault();
        setShowTopGroupList(false);
        setActiveRowSearch(null);
      }
      return;
    }

    // 2. Enter on Last Field Logic
    if (e.key === "Enter") {
      if (field === "openingBalance" || field === "drCr") {
        if (index === rows.length - 1) {
          // In Alteration mode, usually Enter on the last row saves the screen
          // unless the user specifically wants to add a NEW ledger here.
          // Let's assume Tally behavior: Enter on last row empty field = Save.
          e.preventDefault();
          previouslyFocused.current = document.activeElement as HTMLElement;
          setConfirmOpen(true);
        }
      }
    }
  };

  // --- Final Submit ---
  const handleFinalSubmit = () => {
    console.log("--------------------------------");
    console.log("🚀 UPDATING MULTIPLE LEDGERS");
    console.log("Group Context:", selectedGroup);
    console.log("Modified Rows:", rows);
    console.log("--------------------------------");

    // Here you would dispatch an update action
    // dispatch(updateMultipleLedgers(rows));

    setConfirmOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen h-screen flex flex-col w-full bg-[#f2f2f2]">
      {/* Header Bar */}
      <div className="w-full pt-10 px-4 flex items-center justify-between bg-gray-300 shrink-0">
        <h1 className="capitalize text-black text-md font-semibold">
          Multi Ledger Alteration
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
        {/* Top Selection: Filter Group */}
        <div className="w-full bg-[#FFFFD9] border border-gray-400 p-2 mb-2 flex items-center justify-center relative">
          <label className="font-semibold mr-4 text-sm">Under Group:</label>
          <div className="relative">
            <input
              type="text"
              value={selectedGroup}
              onClick={() => setShowTopGroupList(true)}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setShowTopGroupList(true);
              }}
              // When changing group, re-fetch
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowTopGroupList(false);
                  fetchLedgersForGroup(selectedGroup);
                }
              }}
              className="bg-white border border-gray-400 px-2 py-1 w-64 outline-none focus:bg-yellow-100 font-bold text-center"
            />

            {/* Top Dropdown */}
            {showTopGroupList && (
              <div className="absolute top-full left-0 w-full bg-[#C5C6C7] border border-gray-500 z-50 max-h-40 overflow-y-auto">
                {GroupList.filter((g) =>
                  g.toLowerCase().includes(selectedGroup.toLowerCase())
                ).map((g, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer"
                    onClick={() => {
                      setSelectedGroup(g);
                      setShowTopGroupList(false);
                      fetchLedgersForGroup(g);
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
                      onKeyDown={(e) => handleKeyDown(e, index, "ledgerName")}
                    />
                  </td>

                  {/* Under (Group) - Read Only if specific group selected, Editable if 'All Items' */}
                  <td className="border-r border-gray-300 p-0 relative">
                    {selectedGroup === "All Items" ? (
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
                            {GroupList.filter((g) =>
                              g.toLowerCase().includes(row.under.toLowerCase())
                            ).map((g, i) => (
                              <div
                                key={i}
                                className="px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer text-sm"
                                onMouseDown={(e) => {
                                  e.preventDefault();
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
                        {selectedGroup}
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
                        handleKeyDown(e, index, "openingBalance")
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
                      onKeyDown={(e) => handleKeyDown(e, index, "drCr")}
                    >
                      <option value="Dr">Dr</option>
                      <option value="Cr">Cr</option>
                    </select>
                  </td>
                </tr>
              ))}

              {/* Optional: Show message if no rows */}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No Ledgers found in this group
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

export default MultipleLedgerAlteration;
