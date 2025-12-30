import { useEffect, useRef, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalclulatorArea from "../Components/common/CalclulatorArea";
import TallyWindow from "../Components/common/TallyWindow";
import { useAppSelector } from "../store/store";
import { setSidebarButtons } from "./sidebarSlice";
import { useAppDispatch } from "../store/store";
import { setEditing, setSelectedCompany } from "./company/slice";
const GateWayofTally: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [infoMenu, setInfoMenu] = useState<boolean>(false);
  const { selectedCompany } = useAppSelector((state) => state.company);

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

  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  useEffect(() => {
    itemsRef.current[activeIndex]?.focus();
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        navigate("/select-company");
      }

      if (e.altKey && e.key === "F1") {
        console.log("Hello alt+F1");
        e.preventDefault();
        dispatch(setSelectedCompany(null));
        console.log("after alt+F1 selectedCompany", selectedCompany);
        navigate("/");
      }

      if (e.altKey && e.key === "F3") {
        e.preventDefault();
        setInfoMenu(true);
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(-1);
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate(+1);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < itemsRef.current.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : itemsRef.current.length - 1
        );
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const active = itemsRef.current[activeIndex];
        if (active) {
          active.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navigate, dispatch]);

  const functionKeys = [
    { alpha: "F1", text: "Select Comp", alt: false, path: "/select-company" },
    { alpha: "F1", text: "Shut Comp", alt: true }, //close company
    { alpha: "F2", text: "data", alt: false },
    { alpha: "F2", text: "Period", alt: true },
    { alpha: "F3", text: "Cmp Info", alt: true }, // change Gateway of tally opyions
    { alpha: "F4", text: "Connent", alt: false },
    { alpha: "F11", text: "Features", alt: false },
    { alpha: "F12", text: "Configure", alt: false },
  ];

  useEffect(() => {
    if (selectedCompany && functionKeys.length > 0) {
      dispatch(setSidebarButtons(functionKeys));
    }
    return () => {
      dispatch(setSidebarButtons([]));
    };
  }, [functionKeys, selectedCompany]);

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
            {selectedCompany ? (
              infoMenu ? (
                <TallyWindow title="Company info">
                  <div className="flex flex-col gap-3 px-6 pl-8 items-start w-full py-6">
                    <Link
                      to="/select-company"
                      className="focus:bg-[#ABB190] w-full outline-none"
                      ref={(el) => {
                        itemsRef.current[0] = el;
                      }}
                      tabIndex={0}
                    >
                      Select Company
                    </Link>
                    <Link
                      to={""}
                      onClick={() => {
                        dispatch(setSelectedCompany(null));
                        navigate("/");
                      }}
                      className="focus:bg-[#ABB190] w-full text-start outline-none"
                      ref={(el) => {
                        itemsRef.current[1] = el;
                      }}
                      tabIndex={0}
                    >
                      Shut company
                    </Link>
                    <Link
                      to="/create-company"
                      className="focus:bg-[#ABB190] w-full outline-none"
                      ref={(el) => {
                        itemsRef.current[2] = el;
                      }}
                      tabIndex={0}
                    >
                      Create Company
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(setEditing(true));
                        navigate("/create-company");
                      }}
                      className="focus:bg-[#ABB190] text-start w-full outline-none"
                      ref={(el) => {
                        itemsRef.current[3] = el;
                      }}
                      tabIndex={0}
                    >
                      Alter
                    </button>
                  </div>
                </TallyWindow>
              ) : (
                <TallyWindow title="Gateway of Tally">
                  <div className="flex flex-col gap-3 px-6 pl-8 items-start w-full py-6">
                    <div className="flex flex-col mb-2 text-sm w-full">
                      <h2 className="mb-1 text-sm font-semibold">Masters</h2>
                      <Link
                        to="/accounts/accounts-info"
                        className="focus:bg-[#ABB190] w-full outline-none"
                        ref={(el) => {
                          itemsRef.current[0] = el;
                        }}
                        tabIndex={0}
                      >
                        Accounts info
                      </Link>
                      <Link
                        to="/inventory/inventory-info"
                        className="focus:bg-[#ABB190] w-full outline-none"
                        ref={(el) => {
                          itemsRef.current[1] = el;
                        }}
                        tabIndex={0}
                      >
                        Inventory info
                      </Link>
                    </div>
                    <div className="flex flex-col mb-3 text-sm w-full">
                      <h2 className="mb-1 text-sm font-semibold">
                        Transactions
                      </h2>
                      <Link
                        to="/accounts/vouchers"
                        className="focus:bg-[#ABB190] w-full outline-none"
                        ref={(el) => {
                          itemsRef.current[2] = el;
                        }}
                        tabIndex={0}
                      >
                        Accounting vouchers
                      </Link>
                      <Link
                        to="/inventory/inventory-vouchers"
                        className="focus:bg-[#ABB190] w-full outline-none"
                        ref={(el) => {
                          itemsRef.current[3] = el;
                        }}
                        tabIndex={0}
                      >
                        Inventory vouchers
                      </Link>
                    </div>
                  </div>
                </TallyWindow>
              )
            ) : (
              <TallyWindow title="Company Info">
                <div className="flex flex-col gap-3 px-6 pl-8 items-start w-full py-5">
                  <Link
                    to="/select-company"
                    className="focus:bg-[#ABB190] w-full outline-none"
                    ref={(el) => {
                      itemsRef.current[0] = el;
                    }}
                    tabIndex={0}
                  >
                    Select Company
                  </Link>

                  <Link
                    to="/login"
                    className="focus:bg-[#ABB190] w-full outline-none"
                    ref={(el) => {
                      itemsRef.current[1] = el;
                    }}
                    tabIndex={0}
                  >
                    Login as Remote User
                  </Link>

                  <Link
                    to="/create-company"
                    className="focus:bg-[#ABB190] w-full outline-none"
                    ref={(el) => {
                      itemsRef.current[2] = el;
                    }}
                    tabIndex={0}
                  >
                    Create Company
                  </Link>

                  <button
                    className="focus:bg-[#ABB190] w-full outline-none text-left"
                    ref={(el) => {
                      itemsRef.current[3] = el;
                    }}
                    tabIndex={0}
                  >
                    <span className="text-green-900">B</span>ackup
                  </button>

                  <button
                    className="focus:bg-[#ABB190] w-full outline-none text-left"
                    ref={(el) => {
                      itemsRef.current[4] = el;
                    }}
                    tabIndex={0}
                  >
                    <span className="text-green-900">R</span>estore
                  </button>

                  <button
                    className="focus:bg-[#ABB190] w-full outline-none text-left"
                    ref={(el) => {
                      itemsRef.current[5] = el;
                    }}
                    tabIndex={0}
                  >
                    <span className="text-green-900">Q</span>uit
                  </button>
                </div>
              </TallyWindow>
            )}
          </div>
        </div>
      </div>
      <div>
        <CalclulatorArea />
        {/* <Sidebar button={functionKeys}></Sidebar> */}
      </div>
    </div>
  );
};
export default GateWayofTally;
