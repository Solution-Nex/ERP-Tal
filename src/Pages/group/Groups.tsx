import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai"


const Groups: FC = () => {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    document.title = "Groups - SN ERP";
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

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();

    // Prevent browser default for ERP shortcuts
    if (["c", "d", "a", "r", "i", "t", "q"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch (key) {
      case "c":
        navigate("/create-single-group", {
          state: { mode: "create" }
        });

        break;

      case "d":
        navigate("/select-group", {
          state: { mode: "display" }
        });
        break;

      case "a":
        navigate("/select-group", {
          state: { mode: "alter" }
        });

        break;

      case "r":
        navigate("/create-multiple-groups", {
          state: { mode: "create-multiple" }
        });
        break;

      case "i":
        navigate("/display-groups");
        break;

      case "t":
        navigate("/edit-multiple-groups");
        break;

      case "q":
        navigate("/");
        break;
    }

    // Arrow navigation (keep this)
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

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
      e.preventDefault();
      navigate("/groups");
      return;
    }

    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(+1);
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/*Header */}

      <div className="w-full pt-10 flex items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md  font-semibold">
            Gateway of Tally
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-muted">Ctrl + M</h1>
          <button type="button" className=" text-[var(--text)]" aria-label="Close">
            <AiTwotoneCloseSquare className="w-5 h-5" onClick={() => navigate("/")} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
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
                  <td className="px-4 py-2">Desi Compeny</td>
                  <td className="px-4 py-2">20-Dec-2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div className="w-full h-full flex flex-col items-center justify-center">
          <p className="mt-20 italic text-gray-600">Gateway of Tally</p>
          <p className="italic text-gray-600">Account info</p>
          <div className="bg-[#c5c6c7] flex flex-col items-start gap-3 w-full max-w-sm ">
            <h2 className="text-white bg-[#176ee8] text-center w-full">
              Groups
            </h2>

            <div className="flex flex-col gap-3 px-6 pl-8 items-start w-full py-5">

              {/*Single group */}
              <h3 className="font-semibold mb-2">Single Group</h3>
              <button
                onClick={() => {
                  navigate("/create-single-group", {
                    state: { mode: "create" }
                  });
                }}
                className="group focus:bg-[#ABB190] w-full text-start"
                ref={(el) => {
                  itemsRef.current[0] = el;
                }}
                tabIndex={0}
              >
                <span className="group-focus:text-red-600 text-green-700">C</span>reate
              </button>

              <button
                onClick={() => {
                  navigate("/select-group", {
                    state: { mode: "display" }
                  });
                }}
                className="group focus:bg-[#ABB190] w-full text-start"
                ref={(el) => {
                  itemsRef.current[1] = el;
                }}
                tabIndex={0}
              >
                <span className="group-focus:text-red-600 text-green-700">D</span>isplay
              </button>

              <button
                onClick={() => {
                  navigate("/select-group", {
                    state: { mode: "alter" }
                  });
                }}
                className="group focus:bg-[#ABB190] w-full text-start mb-2"
                ref={(el) => {
                  itemsRef.current[2] = el;
                }}
                tabIndex={0}
              >
                <span className="group-focus:text-red-600 text-green-700">A</span>lter
              </button>

              {/*Multiple groups */}

              <h3 className="font-semibold mb-2">Multiple Groups</h3>

              <button
                onClick={() => {
                  navigate("/create-multiple-groups", {
                    state: { mode: "create-multiple" }
                  });
                }}
                className="group focus:bg-[#ABB190] w-full text-start"
                ref={(el) => {
                  itemsRef.current[3] = el;
                }}
                tabIndex={0}
              >
                C<span className="group-focus:text-red-600 text-green-700">R</span>eate
              </button>

              <button
                onClick={() => {
                  navigate("/select-group", {
                    state: { mode: "display-multiple" }
                  });
                }}
                className="group focus:bg-[#ABB190] w-full text-start"
                ref={(el) => {
                  itemsRef.current[4] = el;
                }}
                tabIndex={0}
              >
                D<span className="group-focus:text-red-600 text-green-700">I</span>splay
              </button>

              <button
                onClick={() => {
                  navigate("/select-group", {
                    state: { mode: "alter-multiple" }
                  });
                }}
                className="group focus:bg-[#ABB190] w-full text-start"
                ref={(el) => {
                  itemsRef.current[5] = el;
                }}
                tabIndex={0}
              >
                Al<span className="group-focus:text-red-600 text-green-700">T</span>lter
              </button>

              <button
                className="group focus:bg-[#ABB190] w-full outline-none text-left"
                ref={(el) => {
                  itemsRef.current[6] = el;
                }}
                tabIndex={0}
              >
                <span className="group-focus:text-red-600 text-green-700">Q</span>uit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};
export default Groups;
