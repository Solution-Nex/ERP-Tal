import React from "react";
import Layout from "../Components/Layout";

const SelectCompany = () => {
  return (
    <Layout green_bar_name="Select Company">
      <div className="h-full w-full">
        <div className="w-full max-w-2xl mx-auto flex flex-col px-2 h-full">
          <div className="bg-[#FFFEDC] w-full max-w-lg mx-auto px-5 pt-5 pb-2">
            <h2 className="text-black font-bold text-xl underline text-center">
              Select Company
            </h2>
            <div className="w-full max-w-md flex flex-col gap-2 mt-5">
              <div className="flex justify-between ">
                <label htmlFor="" className="font-semibold">
                  Path :
                </label>
                <span className="w-full max-w-80 font-bold">
                  C:\Users\PubliclTally.ERP9lData
                </span>
              </div>
              <div className="flex justify-between">
                <label htmlFor="" className="font-semibold">
                  Name :
                </label>
                <input
                  type="search"
                  name="companyName"
                  className="bg-black text-white w-full max-w-80 px-2 py-1 outline-none "
                  id=""
                />
              </div>
            </div>
          </div>
          <div className="bg-[#145344] text-white text-center font-serif text-xl w-full max-w-[33rem] mx-auto">
            {" "}
            List of Companies
          </div>
          <div className="bg-[#D3F1D6] text-white text-center font-serif text-xl w-full max-w-[33rem] mx-auto h-full">
            <div className="mt-5">
              <div className="w-full bg-[#80807F] text-white text-left px-3">
                No Companies on Disk{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectCompany;
