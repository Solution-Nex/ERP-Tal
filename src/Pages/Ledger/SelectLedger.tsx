import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { useEffect, useState } from "react";
import CalclulatorArea from "../../Components/common/CalclulatorArea";

const SelectLedger = () => {
  const navigate = useNavigate();
  const [search, setsearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0); // Initialize at 0 to highlight first item

  const LedgerList = ["Cash", "Profit & Loss A/c"];

  const FilterLedger = LedgerList.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    document.title = "Select Ledger - SN ERP";
  }, []);

  const handleSelect = (ledgerName: string) => {
    console.log("Selected Ledger:", ledgerName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (FilterLedger.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < FilterLedger.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : FilterLedger.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (FilterLedger[activeIndex]) {
        handleSelect(FilterLedger[activeIndex]);
      }
    }
  };
  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  return (
    <div className="flex min-h-screen h-full flex-col">
      <div className="w-full pt-10 px-4 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md font-semibold">
            Select Ledger
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

      <div className="w-full h-full flex flex-col overflow-hidden">
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
            />
          </div>
        </div>

        <div className="w-full max-w-[25rem] mx-auto bg-[#C5C6C7] h-full">
          <h2 className="font-serif bg-[#176EE8] text-center text-white py-1 text-xl">
            List of Ledgers
          </h2>
          <div className="py-2 h-full flex-1">
            <ul className="flex flex-col">
              {FilterLedger.map((item, index) => (
                <li
                  key={index}
                  className={`px-3 py-1 cursor-pointer transition-all ${
                    index === activeIndex
                      ? "bg-[#176EE8] text-white"
                      : "hover:bg-gray-400 text-black"
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                >
                  {item}
                </li>
              ))}
              {FilterLedger.length === 0 && (
                <li className="px-3 py-1 text-gray-500 italic">
                  No ledgers found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <CalclulatorArea />
    </div>
  );
};

export default SelectLedger;
