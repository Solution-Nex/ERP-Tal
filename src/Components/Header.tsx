import type { FC } from "react";
import { NavButton } from "./NavButton";

const Header: FC = () => {
  return (
    <>
      <div className="transition-colors border-b border-muted bg-surface ">
        <div className="w-full bg-surface">
          <div className="flex justify-between">
            <NavButton alpha="P:" text="Print" />
            <NavButton alpha="E:" text="Export" />
            <NavButton alpha="M:" text="E-Mail" />
            <NavButton alpha="O:" text="Upload" />
            <NavButton alpha="S:" text="Shop" />
            <NavButton alpha="K:" text="KeyBoard" />
            <NavButton alpha="C:" text="Control Centre" />
            <NavButton alpha="H:" text="Support" />
          </div>
        </div>
      </div>
      {/* <div className="h-10"></div> */}
    </>
  );
};

export default Header;
