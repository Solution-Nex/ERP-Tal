import { type FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "../common/sidebar";
const Layout: FC = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT MAIN AREA */}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>

      {/* RIGHT BLUE STRIP */}
      <div className="w-36 bg-primary py-4 text-sm text-white flex flex-col items-center">
        <Sidebar />
      </div>
    </div>
  );
};
export default Layout;