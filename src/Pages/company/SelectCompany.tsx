import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  fetchCompanies,
  setSelectedCompany,
  type CompanyFromBackend,
} from "./slice";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SelectCompany = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState<string>("");
  const itemsRef = useRef<HTMLDivElement[]>([]);

  const { loading, companies, companiesFetched } = useAppSelector(
    (state) => state.company
  );

  // Fetch companies on mount
  useEffect(() => {
    document.title = "Select Company - SN ERP";
    if (!companiesFetched) dispatch(fetchCompanies());
  }, [companiesFetched, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        navigate("/");
        return;
      }
      if (e.key === "ArrowLeft") {
        navigate(-1);
      }
      if (e.key === "ArrowRight") {
        navigate(+1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Filtered list based on search
  const filteredCompanies = companies.filter((cmp: CompanyFromBackend) =>
    cmp.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle selecting company
  const handleSelectCompany = (company: CompanyFromBackend) => {
    dispatch(setSelectedCompany(company));
    navigate("/");
  };

  return (
    <div className="h-full pt-14 w-full bg-surface">
      <div className="relative h-full px-4">
        <h1 className="absolute top-2 right-14 text-muted">Ctrl + M</h1>
        {/* Close button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-2 right-6 text-gray-700 hover:text-black"
          aria-label="Close"
        >
          <AiTwotoneCloseSquare className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-gray-400 pb-3">
          <h2 className="text-center text-lg font-semibold underline">
            Select Company
          </h2>

          <div className="mt-4 max-w-xl text-sm space-y-2">
            {/* <div className="flex">
              <span className="w-24 font-semibold">Path :</span>
              <span>C:\Users\Public\Tally.ERP9\Data</span>
            </div> */}

            <div className="flex items-center">
              <span className="w-24 font-semibold">Name :</span>
              <input
                type="search"
                name="companyName"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-black text-white px-2 py-[2px] outline-none w-64"
                placeholder="Type to search..."
              />
            </div>
          </div>
        </div>

        {/* List title */}
        <div className="mt-4 bg-[#4e9bf8] border border-gray-400 text-center font-semibold py-1">
          List of Companies
        </div>

        {/* Company list */}
        <div className="border border-gray-400 border-t-0 bg-[#f4f4f4] h-[60vh] overflow-auto">
          {loading ? (
            <div className="py-4 text-center text-sm">Loading...</div>
          ) : filteredCompanies.length > 0 ? (
            filteredCompanies.map((cmp: CompanyFromBackend, i: number) => (
              <div
                key={cmp._id ?? i}
                ref={(el) => {
                  if (el) {
                    itemsRef.current[i] = el;
                  }
                }}
                onClick={() => handleSelectCompany(cmp)}
                className="
                  px-3 py-[5px]
                  border-b border-gray-300
                  text-sm text-black
                  cursor-pointer
                  hover:bg-[#E9EFD9]
                  transition-colors
                "
              >
                {cmp.name}
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-sm">No company found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectCompany;
