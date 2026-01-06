import { type FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout: FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;
