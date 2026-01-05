import { useNavigate } from "react-router-dom";
import type {FC} from "react";
import type { sidebarState } from "../../Pages/sidebarSlice";

export const SidebarButton: FC<sidebarState["button"][number]> = ({ text, alpha, alt, path = "", onClick }) => {
  const navigate = useNavigate();
  return (
    <button
      onDoubleClick={() => (path ? navigate(path) : onClick?.())}
      className="py-1 border-b border-gray-400 w-full flex text-white justify-start gap-1 bg-transparent"
    >
      <span className={`${alt ? "underline" : ""}`}>{alpha}:</span>
      <span>{text}</span>
    </button>
  );
};
