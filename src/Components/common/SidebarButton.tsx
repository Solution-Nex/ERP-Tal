import { useNavigate } from "react-router-dom";
import type {FC} from "react";

export const SidebarButton: FC<{
  text?: string;
  alpha?: string;
  alt?: boolean;
  path: string;
}> = ({ text, alpha, alt, path }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="py-1 ml-2 border-b pt-2 border-gray-400 w-full flex items-center text-white justify-start gap-1 bg-transparent"
    >
      <span className={`${alt ? "underline" : ""}`}>{alpha}:</span>
      <span>{text}</span>
    </button>
  );
  
};
