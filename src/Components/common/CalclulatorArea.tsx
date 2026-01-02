const CalclulatorArea = () => {
  return (
    <div>
      <div className="w-full flex bg-surface items-stretch ">
        <div className="w-full flex justify-center border-r border-gray-700 flex-col">
          {" "}
          <h3 className="bg-[#3b6bef] text-white w-full px-2">Product</h3>
          <div className="px-2">
            Logo
            <div className="w-full bg-[#3b6bef] text-center text-lg text-white font-bold">
               SN ERP
            </div>
          </div>
        </div>
        <div className="w-full flex  border-r border-gray-700 flex-col">
          {" "}
          <h3 className="w-full flex justify-between px-2 bg-[#3b6bef] text-white">
            <span>Version & Update</span> <span>Ctrl+Alt+T</span>
          </h3>
          <div className="px-2">
            Series alpha Release 1.0 <br />
            Latest
          </div>
        </div>
        <div className="w-full flex  border-r border-gray-700 flex-col">
          <h3 className="w-full flex justify-between px-2 bg-[#3b6bef] text-white">
            <span>Licence & Subscription </span>
            <span>ctrl+Alt+L</span>
          </h3>
          {/* <div className="text-sm px-2">Educational Mode</div> */}
        </div>
        <div className="w-full flex  border-r border-gray-700 flex-col">
          <h3 className="w-full flex justify-between px-2 bg-[#3b6bef] text-white">
            <span>Configuration </span>
            <span>Ctrl+Alt+F</span>
          </h3>
          <div className="px-2 ">
            <div className="w-full flex justify-between">
              <span> GateWay </span>
              <span> localhost:9999</span>
            </div>
            <div className="w-full flex justify-between">
              <span> ODBC Server</span>
              <span>9000</span>
            </div>
          </div>
        </div>
        <div className="w-full flex  flex-col">
          <h3 className="w-full flex justify-between items-center bg-[#3b6bef] text-white px-2">
            <span>Calculator</span> <span>Ctrl+N</span>{" "}
          </h3>
          <div className="px-2"></div>
        </div>
      </div>
    </div>
  );
};

export default CalclulatorArea;
