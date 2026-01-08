import type { FC, ReactNode } from "react";
import { useAppSelector } from "../../store/store";
import { SidebarButton } from "./SidebarButton";

const Sidebar: FC = () => {
  const { button } = useAppSelector((state) => state.sidebar);
  return (
    <div className="flex w-full">
      {button.length > 0 &&
        button.map<ReactNode>(
          (btn, i): React.ReactElement => (
            <SidebarButton
              key={i}
              alpha={btn.alpha}
              text={btn.text}
              alt={btn.alt}
              path={btn.path}
              onClick={btn.onClick}
            />
          )
        )}
    </div>
  );
};

export default Sidebar;
