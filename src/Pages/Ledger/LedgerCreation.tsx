import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiTwotoneCloseSquare } from "react-icons/ai";
import Select from "../../Components/Select";
import Field from "../../Components/Field";
const LedgerCreation = () => {
  const navigate = useNavigate();
  // const [showGroupList,set]
  useEffect(() => {
    document.title = "Create Ledger - SN ERP";
  }, []);
  const GroupList = [
    "Bank Accounts",
    "Bank OCC A/c",
    "Bank OD A/c",
    "Branch / Divisons",
    "Capital Account",
    "Cash-in-Hand",
    "Current Assets",
  ];
  const [under, setunder] = useState<string>("");
  const [showGroupList, setGroupList] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const FilterGroupList = GroupList.filter((item) =>
    item.toLowerCase().includes(under.toLowerCase())
  );
  return (
    <div className="min-h-screen h-screen flex flex-col  w-full">
      {" "}
      <div className="w-full pt-10  px-4 flex  items-center justify-between bg-gray-300">
        <div>
          <h1 className="capitalize text-black text-md  font-semibold">
            Ledger Creation
          </h1>
        </div>
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
      <div className="w-full pl-5 flex  justify-between flex-1  h-full overflow-hidden">
        <div className="py-3 w-full  h-full ">
          <form action="" className="h-full">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <Field label="Name" type="text" className="w-full" />
                <Field label="Alias" type="text" className="w-full" />
              </div>
              <div className="flex flex-col items-center justify-center border-gray-400 border">
                <label htmlFor="" className="underline">
                  Total Openeing Balance
                </label>
                <input
                  type="text"
                  value={"200.00$"}
                  readOnly
                  className="bg-transparent text-center h-20"
                />
              </div>
            </div>
            <div className="w-full flex border-gray-400 border-t py-5 h-full">
              <div className="w-full border-gray-400 border-r px-4 ">
                <div>
                  {" "}
                  <Field
                    type="search"
                    label="Under"
                    name="under"
                    value={under}
                    onFocus={() => {
                      setGroupList(true);
                      setActiveIndex(-1);
                    }}
                    onChange={(e) => {
                      setunder(e.target.value);
                      setActiveIndex(-1);
                    }}
                    onKeyDown={(e) => {
                      if (!showGroupList) return;

                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setActiveIndex((prev) =>
                          prev < FilterGroupList.length - 1 ? prev + 1 : 0
                        );
                      }

                      if (e.key === "ArrowUp") {
                        e.preventDefault();
                        setActiveIndex((prev) =>
                          prev > 0 ? prev - 1 : FilterGroupList.length - 1
                        );
                      }

                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (activeIndex >= 0) {
                          setunder(FilterGroupList[activeIndex]);
                          setGroupList(false);
                        }
                      }

                      if (e.key === "Escape") {
                        setGroupList(false);
                      }
                    }}
                  />
                </div>
                <div className="">
                  <Select
                    label="Inventory values are affected"
                    options={["No", "Yes"]}
                    className="items-start w-full justify-start"
                  />
                </div>
              </div>
              <div className="w-full px-4 py-5">
                <h2 className="text-center mb-5">Mailing details</h2>
                <div className="">
                  <Field label="Name" type="text" />
                </div>
                <div className="">
                  <Field label="Address" type="text" />
                </div>
                <div className=" mt-8 ">
                  <Select
                    label="Country"
                    options={["pakistan"]}
                    className="flex justify-between w-full "
                  />
                </div>
                <div className=" w-full mt-5">
                  <div className="w-full">
                    {" "}
                    <Select
                      label="  Provide bank Details"
                      options={["No", "Yes"]}
                      className="items-start w-full"
                    />
                  </div>
                </div>
                <div className="w-full text-center mt-8 mb-8">
                  <h2 className="underline">Tax Registration Details</h2>
                </div>
                <div className="flex justify-between w-full mt-5">
                  <Field type="text" label=" PAN/IT NO." />
                </div>
              </div>
            </div>
          </form>
        </div>{" "}
        {showGroupList ? (
          <div className="w-full max-w-sm bg-[#C5C6C7]   border border-gray-500 h-full overflow-y-auto ">
            <div>
              <h2 className="text-center font-serif text-white text-xl py-1 bg-[#176EE8] w-full">
                List of Groups
              </h2>
              <ul>
                {FilterGroupList.length > 0
                  ? FilterGroupList.map((item, index) => (
                      <li
                        key={index}
                        className={`px-2 py-1 cursor-pointer ${
                          index === activeIndex
                            ? "bg-slate-400"
                            : "hover:bg-gray-400"
                        }`}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => {
                          setunder(item);
                          setGroupList(false);
                        }}
                      >
                        {item}
                      </li>
                    ))
                  : ""}
              </ul>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default LedgerCreation;
