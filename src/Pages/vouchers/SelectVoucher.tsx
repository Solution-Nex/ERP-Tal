import { useLocation, useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchByCompanyId } from "./slice";
import type { VoucherTypeFromBackend } from "./voucherTypes";

const SelectVoucher = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const mode = location.state?.mode;
  const { selectedCompany } = useAppSelector((state) => state.company);
  const { loading, voucherTypes, voucherTypesFetched } = useAppSelector(
    (state) => state.voucherTypes
  );

  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const FilterVoucher = voucherTypes.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    document.title = "Select Voucher Type - SN ERP";
    if (!voucherTypesFetched && selectedCompany) {
      dispatch(fetchByCompanyId(selectedCompany._id)).unwrap();
    }
  }, [selectedCompany, voucherTypesFetched, dispatch]);

  const handleSelect = (voucherType: VoucherTypeFromBackend) => {
    navigate("/voucher-creation", {
      state: {
        mode,
        voucherType,
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // if (FilterVoucher.length === 0) return;

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
      e.preventDefault();
      navigate("/");
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < FilterVoucher.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : FilterVoucher.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (FilterVoucher[activeIndex]) {
        handleSelect(FilterVoucher[activeIndex]);
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
            Select Voucher Type
          </h1>
        </div>
        <div>{selectedCompany?.name}</div>
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

      <div className="w-full h-full flex flex-col mt-5 overflow-hidden">
        <div className="bg-[#C5C6C7] border border-gray-300 w-full max-w-sm mx-auto">
          <h1 className="text-center underline text-xl py-2 font-serif">
            Voucher Types
          </h1>
          <div className="flex items-center justify-center px-4 py-2 w-full">
            <input
              autoFocus
              type="search"
              className="bg-gray-300 focus:bg-black focus:text-white outline-none border-muted focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors w-full py-1 px-2"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              placeholder="Search voucher types..."
            />
          </div>
        </div>

        <div className="w-full max-w-[25rem] mx-auto bg-[#C5C6C7] h-full">
          <h2 className="font-serif bg-[#176EE8] text-center text-white py-1 text-xl">
            List of Voucher Types
          </h2>
          <div className="py-2 h-full flex-1">
            {loading && (
              <li className="px-3 py-1 text-gray-500 italic">
                Fetching voucher types...
              </li>
            )}
            <ul className="flex flex-col">
              {FilterVoucher.map((voucherType, index) => (
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
                    handleSelect(voucherType);
                  }}
                >
                  <span className="flex justify-between items-center">
                    <span>{voucherType.name}</span>
                    {(mode === "display" || mode === "alter") && (
                      <span className="text-xs ml-2 opacity-70">
                        ({mode === "display" ? "👁️ View" : "✏️ Edit"})
                      </span>
                    )}
                  </span>
                </li>
              ))}
              {!loading && FilterVoucher.length === 0 && (
                <li className="px-3 py-1 text-gray-500 italic">
                  No voucher types found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectVoucher;
