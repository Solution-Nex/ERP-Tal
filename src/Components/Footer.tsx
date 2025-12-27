import React from "react";
import {NavButton} from "./NavButton"

const Footer: React.FC = () => {
  return (
    <div className="w-full bg-surface border-t border-muted">
      <div className="flex items-center justify-between">
        <NavButton alpha="Q:" text="Quit" />
        {/* <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton />
        <NavButton /> */}
      </div>
    </div>

  );
};

export default Footer;
