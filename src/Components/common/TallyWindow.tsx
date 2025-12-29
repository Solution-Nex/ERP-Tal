import type { FC, ReactNode } from "react";

interface TallyWindowProp {
  title: string;
  children: ReactNode;
}

const TallyWindow: FC<TallyWindowProp> = ({ title, children }) => {
  return (
    <div className="bg-[#c5c6c7] flex flex-col items-start gap-3 w-full max-w-sm">
      <h2 className="text-white bg-[#176ee8] text-center w-full">{title}</h2>
      {children}
    </div>
  );
};

export default TallyWindow;
