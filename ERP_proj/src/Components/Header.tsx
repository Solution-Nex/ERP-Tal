import React, { type FC } from "react";
import { AiTwotoneCloseSquare } from "react-icons/ai";

const Header: FC = () => {
  return (
    <div>
      <div className="bg-[#B8E0B8] w-full">
        <div className="flex">
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 text-gray-500 gap-1">
            <span className="underline">P:</span>
            <span>Print</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 text-gray-500 gap-1">
            <span className="underline">E:</span>
            <span>Export</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 text-gray-500 gap-1">
            <span className="underline">M:</span>
            <span>E-Mail</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 text-gray-500 gap-1">
            <span className="underline">O:</span>
            <span>Upload</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 gap-1">
            <span className="underline text-green-700">S:</span>
            <span className="text-blue-900">Shop</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 gap-1">
            <span className="underline text-green-700">K:</span>
            <span className="text-blue-900">KeyBoard</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 gap-1">
            <span className="underline text-green-700">K:</span>
            <span className="text-blue-900">Control Centre</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 gap-1">
            <span className="underline text-green-700">H:</span>
            <span className="text-blue-900">Support Centre</span>
          </button>
          <button className="w-full  flex items-start justify-start border border-gray-400 px-2 py-2 gap-1">
            <span className="underline text-green-700">H:</span>
            <span className="text-blue-900">Help</span>
          </button>
        </div>
      </div>
      <div className="bg-[#125446] w-full px-2 flex justify-between">
        <div>
          <h1 className="capitalize text-white">Compney Creation</h1>
        </div>
        <div className="flex items-center gap-1">
          <h1 className="text-white">Ctrl + M</h1>
          <button className="text-2xl">
            <AiTwotoneCloseSquare />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
