import { useEffect, useRef, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalclulatorArea from "../Components/common/CalclulatorArea";
const GateWayofTally: FC = () => {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<string>("");
  const [date, setDate] = useState<string>("");

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

  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    itemsRef.current[activeIndex]?.focus();
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigate(-1);
      }
      if (e.key === "ArrowRight") {
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
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
                  <td className="px-4 py-2">Shahzain Traders</td>
                  <td className="px-4 py-2">20-Dec-2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* RIGHT PANEL */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="bg-[#c5c6c7] flex flex-col items-start gap-3 w-full max-w-sm mt-20">
            <h2 className="text-white bg-[#176ee8] text-center w-full">
              Company Info
            </h2>

            <div className="flex flex-col gap-3 px-6 pl-8 items-start w-full py-5">
              <Link
                to="/select-company"
                className="focus:bg-[#ABB190] w-full outline-none"
                ref={(el) => {
                  itemsRef.current[0] = el;
                }}
                tabIndex={0}
              >
                <span className="text-red-600">S</span>elect Company
              </Link>

              <Link
                to="/login"
                className="focus:bg-[#ABB190] w-full outline-none"
                ref={(el) => {
                  itemsRef.current[1] = el;
                }}
                tabIndex={0}
              >
                <span className="text-green-900">L</span>ogin as Remote User
              </Link>

              <Link
                to="/create-company"
                className="focus:bg-[#ABB190] w-full outline-none"
                ref={(el) => {
                  itemsRef.current[2] = el;
                }}
                tabIndex={0}
              >
                <span className="text-green-900">C</span>reate Company
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
          </div>
        </div>
      </div>
      <div>
        <CalclulatorArea />
      </div>
    </div>
  );
};
export default GateWayofTally;
