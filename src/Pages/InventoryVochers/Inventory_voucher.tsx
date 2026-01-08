import { useEffect, useState, useRef } from "react";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import SideList from "./SideList";
import { BsFillSendFill } from "react-icons/bs";
// Types
type RowData = {
  id: number;
  itemName: string;
  godown: string;
  quantity: number | "";
  rate: number | "";
  amount: number | "";
};

type ActiveSearchState = {
  side: "source" | "dest";
  index: number;
  field: "item" | "godown";
} | null;

const Items = ["Fan", "Bulb", "Wire", "Switch"];
const GowDowns = ["Multan", "Lahore", "Karachi", "Islamabad"];

const Inventory_voucher = () => {
  const navigate = useNavigate();
  // Ref to remember where focus was before popup opened
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const [date, setdata] = useState<String>("");
  const [day, setday] = useState<String>("");

  // --- Row State ---
  const [sourceRows, setSourceRows] = useState<RowData[]>([
    { id: 1, itemName: "", godown: "", quantity: "", rate: "", amount: "" },
  ]);
  const [destRows, setDestRows] = useState<RowData[]>([
    { id: 101, itemName: "", godown: "", quantity: "", rate: "", amount: "" },
  ]);

  // --- Popup/Search/Confirm State ---
  const [showList, setShowList] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false); // NEW: Confirm Modal
  const [activeSearch, setActiveSearch] = useState<ActiveSearchState>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // --- Date Setup ---
  const SetDate = async () => {
    const getDate = new Date();
    const longDayName = getDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    setdata(getDate.toLocaleDateString());
    setday(longDayName);
  };

  useEffect(() => {
    document.title = "Inventroy Voucher - SN ERP";
    SetDate();
  }, []);

  // --- Global Keyboard Listener for Confirmation Modal & Ctrl+A ---
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // 1. If Modal is Open
      if (confirmOpen) {
        e.preventDefault();
        e.stopPropagation();

        if (e.key.toLowerCase() === "y" || e.key === "Enter") {
          handleFinalSubmit();
        } else if (e.key.toLowerCase() === "n" || e.key === "Escape") {
          setConfirmOpen(false);
          // Return focus to input
          setTimeout(() => previouslyFocused.current?.focus(), 0);
        }
        return;
      }

      // 2. Ctrl + A to Save immediately
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        e.preventDefault();
        triggerConfirm();
      }
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [confirmOpen, sourceRows, destRows, date]);

  // --- Logic to Trigger Confirmation ---
  const triggerConfirm = () => {
    // Save current focus
    previouslyFocused.current = document.activeElement as HTMLElement;
    setConfirmOpen(true);
  };

  // --- Final Submit Logic ---
  const handleFinalSubmit = () => {
    // Filter out empty rows if needed, or send as is
    const payload = {
      voucherDate: date,
      voucherDay: day,
      sourceConsumption: sourceRows.filter((r) => r.itemName), // Only rows with items
      destinationProduction: destRows.filter((r) => r.itemName),
    };

    console.log("---------------- FORM SUBMITTED ----------------");
    console.log("JSON Payload:", JSON.stringify(payload, null, 2));
    console.log("Full Object:", payload);
    console.log("------------------------------------------------");

    setConfirmOpen(false);
    // navigate("/"); // Uncomment to redirect after save
  };

  // --- Filtering Logic ---
  const getFilteredList = () => {
    if (!activeSearch) return [];
    const rows = activeSearch.side === "source" ? sourceRows : destRows;
    const query =
      activeSearch.field === "item"
        ? rows[activeSearch.index].itemName
        : rows[activeSearch.index].godown;
    const list = activeSearch.field === "item" ? Items : GowDowns;

    return list.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredList = getFilteredList();

  // --- Handle Input Changes ---
  const handleRowChange = (
    side: "source" | "dest",
    index: number,
    field: keyof RowData,
    value: string | number
  ) => {
    const setRows = side === "source" ? setSourceRows : setDestRows;

    setRows((prev) => {
      const newRows = [...prev];
      const row = { ...newRows[index], [field]: value };

      // Auto Calculation: Amount = Qty * Rate
      if (field === "quantity" || field === "rate") {
        const qty = field === "quantity" ? Number(value) : Number(row.quantity);
        const rate = field === "rate" ? Number(value) : Number(row.rate);
        row.amount = qty && rate ? qty * rate : "";
      }

      newRows[index] = row;
      return newRows;
    });

    // Trigger Popup for searchable fields
    if (field === "itemName" || field === "godown") {
      setActiveSearch({
        side,
        index,
        field: field === "itemName" ? "item" : "godown",
      });
      setShowList(true);
      setActiveIndex(-1);
    }
  };

  // --- Handle Selection from SideList ---
  const handleSelect = (item: string) => {
    if (!activeSearch) return;
    const { side, index, field } = activeSearch;

    const setRows = side === "source" ? setSourceRows : setDestRows;
    setRows((prev) => {
      const newRows = [...prev];
      newRows[index] = {
        ...newRows[index],
        [field === "item" ? "itemName" : "godown"]: item,
      };
      return newRows;
    });

    setShowList(false);
    setActiveSearch(null);
  };

  // --- Add New Row Logic ---
  const addNewRow = (side: "source" | "dest") => {
    const newRow: RowData = {
      id: Date.now(),
      itemName: "",
      godown: "",
      quantity: "",
      rate: "",
      amount: "",
    };
    if (side === "source") setSourceRows((prev) => [...prev, newRow]);
    else setDestRows((prev) => [...prev, newRow]);
  };

  // --- Keyboard Handling (Row Navigation & Enter Logic) ---
  const handleKeyDown = (
    e: React.KeyboardEvent,
    side: "source" | "dest",
    index: number,
    field: keyof RowData
  ) => {
    // 1. Side List Navigation
    if (showList) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredList.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredList.length - 1
        );
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(filteredList[activeIndex]);
      } else if (e.key === "Escape") {
        setShowList(false);
      }
      return;
    }

    // 2. Logic for "Item Name" Field
    if (field === "itemName" && e.key === "Enter") {
      const rows = side === "source" ? sourceRows : destRows;
      // If Item Name is empty, it usually means "End of List" -> Save
      if (rows[index].itemName.trim() === "") {
        e.preventDefault();
        triggerConfirm();
        return;
      }
    }

    // 3. Logic for "Amount" Field (Last Field)
    if (e.key === "Enter" && field === "amount") {
      const rows = side === "source" ? sourceRows : destRows;
      const currentRow = rows[index];

      // If Amount/Row is filled, Add New Row
      if (currentRow.itemName !== "" && currentRow.amount !== "") {
        if (index === rows.length - 1) {
          addNewRow(side);
        }
      } else {
        // If row is empty or incomplete and user presses Enter on Amount, usually Save
        e.preventDefault();
        triggerConfirm();
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="w-full pt-10 px-4 flex items-center justify-between bg-gray-300 shrink-0">
        <div>
          <h1 className="capitalize text-black text-md font-semibold">
            Inventory Voucher
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-muted text-sm">(submit) Ctrl + A </h1>
          <button type="button" onClick={() => triggerConfirm()}>
            <BsFillSendFill className="w-3 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-muted text-sm">Ctrl + M</h1>
          <button type="button" onClick={() => navigate("/")}>
            <AiTwotoneCloseSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex justify-between mx-3 py-2 shrink-0">
        <div className="flex gap-4 my-2 ">
          <span className="bg-[#3A6EE8] text-white text-lg px-4">
            Stock Journal
          </span>
          <span className="text-lg text-black">No. 1</span>
        </div>
        <div className="flex flex-col items-end justify-end">
          <span className="font-bold text-lg text-black">{date}</span>
          <span className="text-sm text-black">{day}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="flex flex-1 w-full overflow-hidden px-1 pb-2 gap-1">
        {/* Left Side: Source */}
        <div className="w-1/2 flex flex-col h-full border border-black bg-white">
          <div className="text-center border-b border-black font-semibold bg-gray-200 py-1 shrink-0">
            Source (Consumption)
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-400">
                  <th className="text-left px-2 py-1 w-[40%]">Name of Item</th>
                  <th className="text-center px-2 py-1 w-[20%]">Godown</th>
                  <th className="text-right px-2 py-1 w-[10%]">Qty</th>
                  <th className="text-right px-2 py-1 w-[10%]">Rate</th>
                  <th className="text-right px-2 py-1 w-[20%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sourceRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-dotted border-gray-300"
                  >
                    {/* Item Name */}
                    <td className="p-1">
                      <input
                        type="text"
                        value={row.itemName}
                        placeholder={
                          index === sourceRows.length - 1 ? "End of List" : ""
                        }
                        onFocus={() => {
                          setActiveSearch({
                            side: "source",
                            index,
                            field: "item",
                          });
                          setShowList(true);
                        }}
                        onChange={(e) =>
                          handleRowChange(
                            "source",
                            index,
                            "itemName",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, "source", index, "itemName")
                        }
                        className="w-full bg-transparent outline-none focus:bg-yellow-100 px-1 placeholder:text-xs placeholder:italic"
                      />
                    </td>
                    {/* Godown */}
                    <td className="p-1">
                      <input
                        type="text"
                        value={row.godown}
                        onFocus={() => {
                          setActiveSearch({
                            side: "source",
                            index,
                            field: "godown",
                          });
                          setShowList(true);
                        }}
                        onChange={(e) =>
                          handleRowChange(
                            "source",
                            index,
                            "godown",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, "source", index, "godown")
                        }
                        className="w-full bg-transparent outline-none text-center focus:bg-yellow-100 px-1"
                      />
                    </td>
                    {/* Qty */}
                    <td className="p-1">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) =>
                          handleRowChange(
                            "source",
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-right focus:bg-yellow-100 px-1"
                      />
                    </td>
                    {/* Rate */}
                    <td className="p-1">
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) =>
                          handleRowChange(
                            "source",
                            index,
                            "rate",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-right focus:bg-yellow-100 px-1"
                      />
                    </td>
                    {/* Amount */}
                    <td className="p-1">
                      <input
                        type="number"
                        readOnly
                        value={row.amount}
                        onKeyDown={(e) =>
                          handleKeyDown(e, "source", index, "amount")
                        }
                        className="w-full bg-transparent outline-none text-right font-semibold focus:bg-yellow-100 px-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer Total */}
          <div className="border-t border-black p-2 bg-gray-100 shrink-0 text-right">
            Total:{" "}
            {sourceRows.reduce(
              (acc, curr) => acc + Number(curr.amount || 0),
              0
            )}
          </div>
        </div>

        {/* Right Side: Destination */}
        <div className="w-1/2 flex flex-col h-full border border-black bg-white">
          <div className="text-center border-b border-black font-semibold bg-gray-200 py-1 shrink-0">
            Destination (Production)
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-400">
                  <th className="text-left px-2 py-1 w-[40%]">Name of Item</th>
                  <th className="text-center px-2 py-1 w-[20%]">Godown</th>
                  <th className="text-right px-2 py-1 w-[10%]">Qty</th>
                  <th className="text-right px-2 py-1 w-[10%]">Rate</th>
                  <th className="text-right px-2 py-1 w-[20%]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {destRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-dotted border-gray-300"
                  >
                    <td className="p-1">
                      <input
                        type="text"
                        value={row.itemName}
                        placeholder={
                          index === destRows.length - 1 ? "End of List" : ""
                        }
                        onFocus={() => {
                          setActiveSearch({
                            side: "dest",
                            index,
                            field: "item",
                          });
                          setShowList(true);
                        }}
                        onChange={(e) =>
                          handleRowChange(
                            "dest",
                            index,
                            "itemName",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, "dest", index, "itemName")
                        }
                        className="w-full bg-transparent outline-none focus:bg-yellow-100 px-1 placeholder:text-xs placeholder:italic"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="text"
                        value={row.godown}
                        onFocus={() => {
                          setActiveSearch({
                            side: "dest",
                            index,
                            field: "godown",
                          });
                          setShowList(true);
                        }}
                        onChange={(e) =>
                          handleRowChange(
                            "dest",
                            index,
                            "godown",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleKeyDown(e, "dest", index, "godown")
                        }
                        className="w-full bg-transparent outline-none text-center focus:bg-yellow-100 px-1"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) =>
                          handleRowChange(
                            "dest",
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none text-right focus:bg-yellow-100 px-1"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        value={row.rate}
                        onChange={(e) =>
                          handleRowChange("dest", index, "rate", e.target.value)
                        }
                        className="w-full bg-transparent outline-none text-right focus:bg-yellow-100 px-1"
                      />
                    </td>
                    <td className="p-1">
                      <input
                        type="number"
                        readOnly
                        value={row.amount}
                        onKeyDown={(e) =>
                          handleKeyDown(e, "dest", index, "amount")
                        }
                        className="w-full bg-transparent outline-none text-right font-semibold focus:bg-yellow-100 px-1"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Footer Total */}
          <div className="border-t border-black p-2 bg-gray-100 shrink-0 text-right">
            Total:{" "}
            {destRows.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)}
          </div>
        </div>
      </section>

      {/* Side List Component */}
      <SideList
        isOpen={showList}
        filteredList={filteredList}
        activeIndex={activeIndex}
        onSelect={handleSelect}
        onHover={setActiveIndex}
        ListName={activeSearch?.field === "item" ? "Items" : "Godowns"}
      />

      {/* --- CONFIRMATION MODAL --- */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[#FFFFD9] border-2 border-black shadow-2xl p-6 w-[300px] text-center">
            <h2 className="text-xl font-bold mb-6">Accept?</h2>
            <div className="flex justify-around">
              <button
                onClick={handleFinalSubmit}
                className="px-6 py-2 bg-blue-600 text-white font-bold hover:bg-blue-700 border border-black"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setTimeout(() => previouslyFocused.current?.focus(), 0);
                }}
                className="px-6 py-2 bg-gray-200 text-black font-bold hover:bg-gray-300 border border-black"
              >
                No
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              (Press 'Y' or 'Enter' for Yes, 'N' or 'Esc' for No)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory_voucher;
