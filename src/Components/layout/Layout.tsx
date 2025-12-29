import { type FC } from "react";
// import HorizontalBar from "./HorizontalBar";
// import CalclulatorArea from "./CalclulatorArea";
import { Outlet } from "react-router-dom";
// import Footer from "./Footer";
import Header from "./Header";

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
      <div className="w-36 bg-primary" />
    </div>
  );
};
export default Layout;