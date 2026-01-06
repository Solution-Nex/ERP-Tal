import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Components/common/Sidebar";
import TallyWindow from "../Components/common/TallyWindow";
import { useAppSelector } from "../store/store";
import { setSidebarButtons } from "./sidebarSlice";
import { useAppDispatch } from "../store/store";
import { setEditing, setSelectedCompany } from "./company/slice";
import type { CompanyFromBackend } from "./company/slice";
import type { MenuState, MenuItem } from "./menuConfig";
import { menuTitles, createMenuItems } from "./menuConfig";

const GateWayofTally: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [menuState, setMenuState] = useState<MenuState>("gateway");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const itemsRef = useRef<Map<string, HTMLElement | null>>(new Map());
  const { selectedCompany } = useAppSelector((state) => state.company) as {
    selectedCompany: CompanyFromBackend | null;
  };

  useEffect(() => {
    document.title = "Gateway of Tally - SN ERP";
    const now = new Date();

    setPeriod(
      now.toLocaleString("default", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    setDate(now.toLocaleDateString());
  }, []);

  useEffect(() => {
    const items = Array.from(itemsRef.current.values());
    items[activeIndex]?.focus();
  }, [activeIndex]);

  // Select Company
  const handleSelectCompany = () => navigate("/select-company");

  // Shut Company
  const handleShutCompany = () => {
    dispatch(setSelectedCompany(null));
    navigate("/");
  };

  // Alter Company
  const handleAlterCompany = () => {
    dispatch(setEditing(true));
    navigate("/create-company");
  };

  // Handle Menu Action
  const handleMenuAction = (action: MenuState | (() => void)) => {
    if (typeof action === "function") {
      action();
    } else {
      setMenuState(action);
      setActiveIndex(0);
      itemsRef.current.clear();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 - Select Company
      if (e.key === "F1" && !e.altKey) {
        e.preventDefault();
        handleSelectCompany();
        return;
      }

      // Alt+F1 - Shut Company
      if (e.altKey && e.key === "F1") {
        e.preventDefault();
        handleShutCompany();
        return;
      }

      // Alt+F3 - Company Info
      if (e.altKey && e.key === "F3") {
        e.preventDefault();
        if (selectedCompany) {
          handleMenuAction("info");
        }
        return;
      }

      // Arrow navigation
      const items = Array.from(itemsRef.current.values());
      const itemCount = items.length;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < itemCount - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : itemCount - 1));
        return;
      }

      // Enter - Click active item
      if (e.key === "Enter") {
        e.preventDefault();
        const active = items[activeIndex];
        active?.click();
        return;
      }

      // Escape - Go back
      if (e.key === "Escape") {
        e.preventDefault();
        if (menuState === "ledgers" || menuState === "groups") {
          handleMenuAction("accounts");
        } else if (menuState === "accounts" || menuState === "info") {
          handleMenuAction("gateway");
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, menuState, selectedCompany, dispatch]);

  const openCompanyInfo = (): void => handleMenuAction("info");

  useEffect(() => {
    const functionKeys = [
      { alpha: "F1", text: "Select Comp", alt: false, path: "/select-company" },
      { alpha: "F1", text: "Shut Comp", alt: true },
      { alpha: "F3", text: "Cmp Info", alt: true, onClick: openCompanyInfo },
    ];

    if (selectedCompany && functionKeys.length > 0) {
      dispatch(setSidebarButtons(functionKeys));
    }
    return () => {
      dispatch(setSidebarButtons([]));
    };
  }, [selectedCompany, dispatch]);

  // Create menu items based on dependencies
  const menuItems = createMenuItems(
    selectedCompany,
    handleMenuAction,
    handleShutCompany,
    handleAlterCompany
  );

  const currentMenuItems = menuItems[menuState];

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => {
      const isLink = item.path && !item.onClick;
      const isMasterItem =
        menuState === "gateway" &&
        ["accounts-info", "inventory-info"].includes(item.id);
      const isTransactionItem =
        menuState === "gateway" &&
        ["accounting-vouchers", "inventory-vouchers"].includes(item.id);

      return (
        <div className="w-full" key={item.id}>
          {isMasterItem && index === 0 && (
            <h2 className="mb-2 text-sm font-bold">Masters</h2>
          )}
          {isTransactionItem && index === 2 && (
            <h2 className="mb-2 text-sm font-bold">Transactions</h2>
          )}
          {isLink ? (
            <a
              href={item.path}
              className="focus:bg-[#ABB190] w-full outline-none block cursor-pointer"
              ref={(el) => {
                if (el) itemsRef.current.set(item.id, el);
              }}
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path || "/");
              }}
            >
              {item.label}
            </a>
          ) : (
            <button
              onClick={() => item.onClick?.()}
              className="focus:bg-[#ABB190] text-start w-full outline-none"
              ref={(el) => {
                if (el) itemsRef.current.set(item.id, el);
              }}
              tabIndex={0}
            >
              {item.shortcutKey ? (
                <>
                  <span className="text-green-900">{item.shortcutKey}</span>
                  {item.label.slice(1)}
                </>
              ) : (
                item.label
              )}
            </button>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Main content */}
      <div className="flex flex-1 pt-10">
        {/* LEFT PANEL */}
        <div className="border-r-2 border-gray-400 w-full">
          <div className="flex justify-between w-full items-start px-4 py-4 ">
            <div className="flex flex-col items-center justify-center text-sm gap-1">
              {" "}
              <label htmlFor="" className="italic text-gray-800">
                Current Period
              </label>
              <input
                type="text"
                value={period}
                readOnly
                className="text-center bg-transparent italic"
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-1 text-sm">
              {" "}
              <label htmlFor="" className="italic text-gray-800">
                Current Date
              </label>
              <input
                type="text"
                value={date}
                readOnly
                className="bg-transparent text-center italic"
              />
            </div>
          </div>
          <div>
            <h1 className="underline text-black font-sans text-lg w-full font-semibold text-center">
              List of Selected Companies
            </h1>
          </div>
          <div className="w-full mt-5">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-black opacity-80 italic font-normal">
                    Name of Company
                  </th>
                  <th className="px-4 py-2 text-left text-black opacity-80 italic font-normal">
                    Date of Last Entry
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">
                    {selectedCompany
                      ? selectedCompany.name
                      : "No selected Company"}
                  </td>
                  <td className="px-4 py-2">20-Dec-2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* RIGHT PANEL */}
        <div className="w-full h-full my-auto flex justify-center">
          <div className="bg-[#c5c6c7] flex flex-col items-start gap-3 w-full max-w-sm">
            <TallyWindow title={menuTitles[menuState]}>
              <div className="flex flex-col gap-3 px-6 pl-8 items-start w-full py-6">
                {renderMenuItems(currentMenuItems)}
              </div>
            </TallyWindow>
          </div>
        </div>
      </div>
      <div className="bg-primary border-t border-gray-400 py-4 text-sm text-white flex flex-col items-center">
        <Sidebar />
      </div>
    </div>
  );
};
export default GateWayofTally;
