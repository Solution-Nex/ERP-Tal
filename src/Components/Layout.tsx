import React, { type FC, type ReactNode } from "react";
import HorizontalBar from "./HorizontalBar";
import CalclulatorArea from "./CalclulatorArea";
import type { LayoutProps } from "../types";

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen">
      <HorizontalBar />
      {children}
      <CalclulatorArea />
    </div>
  );
};

export default Layout;
