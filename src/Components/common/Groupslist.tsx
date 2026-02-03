import { useEffect, useRef, useMemo, useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { useAppSelector } from "../../store/store";
import type { GroupFromBackend } from "../../Pages/group/types";
// import type { GroupFromBackend } from "../../Pages/group/types";
// import Sidebar from "./Sidebar";

const GROUPS = [
  {
  // id: 1,
  name: "Bank Accounts",
  alias: "Bank A/cs",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },
  {
  // id: 2,/
  name: "Bank OCC A/c",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },
  {
  // id: 3,
  name: "Bank OCC A/c",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },
  {
  // id: 4,
  name: "Bank OD A/c",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },
  {
  // id: 5,
  name: "Bank OD A/c",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },
  {
  // id: 6,
  name: "Branch / Divisions",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },
  {
  // id: 7,
  name: "Capital Account",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },
  {
  // id: 8,
  name: "Cash-in-Hand",
  under: "Current Assets",
  behavesLikeSubLedger: "No",
  netDebitCredit: "Yes",
  usedForCalculation: "Yes",
  allocationMethod: "None",
  companyId: "<company_id>",
  createdAt: "10/20/2023",
  updatedAt: "10/20/2023",
  },

];

const SelectGroup: FC = () => {
  const location = useLocation();
  const mode = location.state?.mode; // "display" | "alter"

  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const searchRef = useRef<HTMLInputElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const selectedCompany = useAppSelector((state) => state.company.selectedCompany);

  useEffect(() => {
    selectedCompany ?? navigate("/select-company");
  }, [selectedCompany, navigate]);

  useEffect(() => {
    if (activeIndex === -1) {
      searchRef.current?.focus();
    } else {
      itemsRef.current[activeIndex]?.focus();
    }
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex(-1); // explicitly input
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(+1);

      if (e.key === "ArrowDown") {
        e.preventDefault();

        if (activeIndex === -1) {
          setActiveIndex(0);
          return;
        }

        setActiveIndex((prev) =>
          prev < itemsRef.current.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        if (activeIndex === 0) {
          setActiveIndex(-1);
          return;
        }

        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/");
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navigate]);

  const filteredGroups = useMemo(() => {
    return GROUPS.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const handleSelect = (group: Partial<GroupFromBackend>) => {
    if (mode == "create" || mode === "display" || mode === "alter") {
      navigate("/create-single-group", {
        state: {
          mode,
          group: group,
        },
      });
    } else {
      navigate("/create-multiple-groups", {
        state: {
          mode,
          group: group,
        },
      });
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md  font-semibold">
            Select Group
          </h1>
        </div>
        <h1 className="capitalize text-black text-md  font-semibold">
          {selectedCompany && selectedCompany.name}
        </h1>
        <div className="flex items-center gap-3">
          <h1 className="text-muted">Ctrl + M</h1>
          <button
            type="button"
            className=" text-[var(--text)]"
            aria-label="Close"
          >
            <AiTwotoneCloseSquare
              className="w-5 h-5"
              onClick={() => navigate("/")}
            />
          </button>
        </div>
      </div>

      {/* Center panel */}
      <div className="w-[300px] bg-[#c5c6c7] m-auto border-2 border-gray-400 shadow-md">
        <h1 className="text-center text-lg font-semibold underline mb-1 ">
          Name of Group{" "}
        </h1>
        {/* Search */}
        <div className="p-2 border-b border-gray-400 ">
          <input
            ref={searchRef}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-300 focus:bg-black focus:text-white outline-none w-full"
          />
        </div>

        {/* List */}
        <h1 className="text-white bg-[#176ee8] text-center w-full mb-2">
          List of Groups
        </h1>
        <div className="max-h-[488px] min-h-[488px] overflow-y-auto no-scrollbar">
          {filteredGroups.map((group, idx) => (
            <div
              key={idx}
              ref={(el) => {
                itemsRef.current[idx] = el;
              }}
              tabIndex={-1}
              onClick={() => handleSelect(group as Partial<GroupFromBackend>)}
              onKeyDown={(e) => e.key === "Enter" && handleSelect(group as Partial<GroupFromBackend>)}
              className="px-3 py-1 text-sm cursor-pointer focus:bg-[#ABB190] outline-none"
            >
              {group.name}
            </div>
          ))}

          {filteredGroups.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-600">
              No groups found
            </div>
          )}
        </div>
      </div>
      {/* <div className="bg-primary border-t border-gray-400 py-4 text-sm text-white flex flex-col items-center">
                <Sidebar />
            </div> */}
    </div>
  );
};

export default SelectGroup;
