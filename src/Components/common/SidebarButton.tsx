import { useNavigate } from "react-router-dom";
import type {FC} from "react";

export const SidebarButton: FC<{
  text: string;
  alpha: string;
  alt: boolean;
  path?: string;
}> = ({ text, alpha, alt, path }) => {
  const navigate = useNavigate();
  return (
    <button
      onDoubleClick={() => path && path !== "" && navigate(path)}
      className="py-1 border-b border-gray-400 w-full flex text-white justify-start gap-1 bg-transparent"
    >
      <span className={`${alt ? "underline" : ""}`}>{alpha}:</span>
      <span>{text}</span>
    </button>
  );
  
};
