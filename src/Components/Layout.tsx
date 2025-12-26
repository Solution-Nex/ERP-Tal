import React, { type FC, type ReactNode } from "react";
import HorizontalBar from "./HorizontalBar";
import CalclulatorArea from "./CalclulatorArea";
import type { LayoutProps } from "../types";

const Layout: FC<LayoutProps> = ({ children, green_bar_name }) => {
  return (
    <div className="w-full flex ">
      <div className="h-screen w-full">
        <HorizontalBar green_bar_name={green_bar_name} />
        {children}
        <CalclulatorArea />
      </div>
      <div className="w-full  max-w-32 flex flex-col gap-1 bg-[#0B3A33] ">
        <div className="bg-[#115445] px-3 py-3  text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
        <div className="bg-[#115445] px-3 py-2 text-white text-center rounded-tl-sm rounded-bl-sm">
          F10
        </div>
      </div>
    </div>
  );
};

export default Layout;
