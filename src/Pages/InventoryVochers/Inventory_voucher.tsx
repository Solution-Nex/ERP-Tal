import { useEffect, useState, useRef } from "react";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import SideList from "./SideList"; // Assuming you have this component

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
  const [date, setdata] = useState<String>("");
  const [day, setday] = useState<String>("");

  // --- Row State ---
  const [sourceRows, setSourceRows] = useState<RowData[]>([
    { id: 1, itemName: "", godown: "", quantity: "", rate: "", amount: "" },
  ]);
  const [destRows, setDestRows] = useState<RowData[]>([
    { id: 101, itemName: "", godown: "", quantity: "", rate: "", amount: "" },
  ]);

  // --- Popup/Search State ---
  const [showList, setShowList] = useState<boolean>(false);
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

  // --- Keyboard Handling (Enter to add row) ---
  const handleKeyDown = (
    e: React.KeyboardEvent,
    side: "source" | "dest",
    index: number,
    field: keyof RowData
  ) => {
    // List Navigation
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

    // Add new Row on Enter at the last field
    if (e.key === "Enter" && field === "amount") {
      const rows = side === "source" ? sourceRows : destRows;
      if (index === rows.length - 1) {
        addNewRow(side);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="w-full pt-10 px-4 flex items-center justify-between bg-gray-300 shrink-0">
        <div>
          <h1 className="capitalize text-black text-md font-semibold">
            Inventory Voucher
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
      {/* Height fix: flex-1 takes remaining space, overflow-hidden preventing full page scroll */}
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
                        className="w-full bg-transparent outline-none focus:bg-yellow-100 px-1"
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
          {/* Footer Total (Optional) */}
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
                        className="w-full bg-transparent outline-none focus:bg-yellow-100 px-1"
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
          {/* Footer Total (Optional) */}
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
    </div>
  );
};

export default Inventory_voucher;
