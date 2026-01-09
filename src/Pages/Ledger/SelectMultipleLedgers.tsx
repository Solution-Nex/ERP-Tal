import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare, AiOutlineCheck } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchLedgers, type LedgerFromBackend } from "../Ledger/LedgerSlice"; // Verify path
import CalclulatorArea from "../../Components/CalclulatorArea";

const SelectMultipleLedgers = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 1. Get Data from Redux
  const { ledgers, ledgersFetched } = useAppSelector((state) => state.ledger);

  const [search, setsearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Store IDs of selected ledgers
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 2. Fetch on mount
  useEffect(() => {
    document.title = "Select Multiple Ledgers - SN ERP";
    if (!ledgersFetched) {
      dispatch(fetchLedgers());
    }
  }, [ledgersFetched, dispatch]);

  // 3. Filter Logic
  const FilterLedger = ledgers.filter((item) =>
    item.ledgerName.toLowerCase().includes(search.toLowerCase())
  );

  // 4. Toggle Selection (Add/Remove from array)
  const handleToggle = (id: string) => {
    setSelectedIds(
      (prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id) // Uncheck
          : [...prev, id] // Check
    );
  };

  // 5. Final Submit
  const handleSubmit = () => {
    if (selectedIds.length === 0) return;

    // Get full objects based on IDs
    const selectedObjects = ledgers.filter((l) => selectedIds.includes(l._id));

    console.log("--------------------------------");
    console.log("🚀 SELECTED MULTIPLE LEDGERS:");
    console.log(selectedObjects);
    console.log("--------------------------------");

    // Here you can dispatch them to a store or navigate to a bulk edit page
    // navigate("/bulk-edit");
  };

  // Reset active index on search
  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  // 6. Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // A. Arrow Navigation
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (FilterLedger.length > 0) {
        setActiveIndex((prev) =>
          prev < FilterLedger.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (FilterLedger.length > 0) {
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : FilterLedger.length - 1
        );
      }
    }

    // B. Spacebar -> Toggle Selection
    else if (e.code === "Space") {
      e.preventDefault();
      if (FilterLedger[activeIndex]) {
        handleToggle(FilterLedger[activeIndex]._id);
      }
    }

    // C. Enter -> Submit (if items selected) OR Toggle (if none selected)
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIds.length > 0) {
        // If we have selections, Enter acts as "Done"
        handleSubmit();
      } else if (FilterLedger[activeIndex]) {
        // If nothing selected yet, Enter acts as "Select this one"
        handleToggle(FilterLedger[activeIndex]._id);
      }
    }
  };

  return (
    <div className="flex min-h-screen h-full flex-col">
      <div className="w-full pt-10 px-4 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md font-semibold">
            Select Multiple Ledgers
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-muted text-sm">
            Space to Select • Enter to Done
          </h1>
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Close"
          >
            <AiTwotoneCloseSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full h-full flex flex-col overflow-hidden relative">
        {/* Search Input */}
        <div className="bg-[#C5C6C7] border border-gray-300 w-full max-w-sm mx-auto">
          <h1 className="text-center underline text-xl py-2 font-serif">
            Name of Ledger
          </h1>
          <div className="flex items-center justify-center px-4 py-2 w-full">
            <input
              autoFocus
              type="search"
              className="bg-gray-300 focus:bg-black focus:text-white outline-none border-muted focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors w-full py-1 px-2"
              name="search"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* List Section */}
        <div className="w-full max-w-[25rem] mx-auto bg-[#C5C6C7] h-full flex flex-col">
          <h2 className="font-serif bg-[#176EE8] text-center text-white py-1 text-xl">
            List of Ledgers
          </h2>

          <div className="py-2 h-full flex-1 overflow-y-auto max-h-[55vh]">
            <ul className="flex flex-col">
              {FilterLedger.map((item, index) => {
                const isSelected = selectedIds.includes(item._id);
                const isActive = index === activeIndex;

                return (
                  <li
                    key={item._id}
                    className={`
                      px-3 py-1 cursor-pointer transition-all flex justify-between items-center
                      ${
                        isActive
                          ? "bg-[#176EE8] text-white" // Active (Cursor) Style
                          : isSelected
                          ? "bg-[#FFFFD9] text-black" // Selected but not active Style
                          : "hover:bg-gray-400 text-black" // Default
                      }
                      ${
                        isSelected && isActive
                          ? "bg-yellow-500 text-black font-bold"
                          : ""
                      } // Conflict style (Selected & Active)
                    `}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle(item._id);
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{item.ledgerName}</span>
                      <span
                        className={`text-xs italic ${
                          isActive ? "text-gray-200" : "text-gray-600"
                        }`}
                      >
                        {item.under}
                      </span>
                    </div>

                    {/* Checkmark Icon if selected */}
                    {isSelected && <AiOutlineCheck className="font-bold" />}
                  </li>
                );
              })}

              {FilterLedger.length === 0 && (
                <li className="px-3 py-1 text-gray-500 italic text-center">
                  No ledgers found
                </li>
              )}
            </ul>
          </div>

          {/* Bottom Bar showing Selection Count */}
          {selectedIds.length > 0 && (
            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
              <span className="text-sm">{selectedIds.length} selected</span>
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 text-sm rounded"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
      <CalclulatorArea />
    </div>
  );
};

export default SelectMultipleLedgers;
