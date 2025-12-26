import type { FC } from "react";

const Header: FC = () => {
  return (
    <>
      <div className="transition-colors fixed top-0 left-0 right-0 z-10 shadow-md">
        <div className="w-full bg-surface border-b border-muted">
          <div className="flex p-3">
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 text-muted gap-2">
              <span className="underline text-accent">P:</span>
              <span className="text-accent">Print</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 text-muted gap-2">
              <span className="underline text-accent">E:</span>
              <span className="text-accent">Export</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 text-muted gap-2">
              <span className="underline text-accent">M:</span>
              <span className="text-accent">E-Mail</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 text-muted gap-2">
              <span className="underline text-accent">O:</span>
              <span className="text-accent">Upload</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 gap-2">
              <span className="underline text-accent">S:</span>
              <span className="text-accent">Shop</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 gap-2">
              <span className="underline text-accent">K:</span>
              <span className="text-accent">KeyBoard</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 gap-2">
              <span className="underline text-accent">K:</span>
              <span className="text-accent">Control Centre</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 gap-2">
              <span className="underline text-accent">H:</span>
              <span className="text-accent">Support Centre</span>
            </button>
            <button className="w-full  flex items-start justify-start border border-muted px-3 py-2 gap-2">
              <span className="underline text-accent">H:</span>
              <span className="text-accent">Help</span>
            </button>
          </div>
        </div>

        
      </div>
      <div className="h-16"></div>
    </>
  );
};

export default Header;
