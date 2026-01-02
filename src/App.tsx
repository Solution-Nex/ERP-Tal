import { lazy } from "react";
import "./index.css";
// import Home from './Pages/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Layout = lazy(() => import("./Components/Layout"));
const GateWayofTally = lazy(() => import("./Pages/GateWayofTally"));
const SelectCompany = lazy(() => import("./Pages/company/SelectCompany"));
const Compneycreation = lazy(() => import("./Pages/company/Compneycreation"));
const LoginPage = lazy(() => import("./Pages/auth/Login"));
const LedgerCreation = lazy(() => import("./Pages/Ledger/LedgerCreation"));
const SelectLedger = lazy(() => import("./Pages/Ledger/SelectLedger"));
function App() {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GateWayofTally />}></Route>
          <Route path="/select-company" element={<SelectCompany />}></Route>
          <Route path="/create-company" element={<Compneycreation />}></Route>
          <Route path="ledger-creation" element={<LedgerCreation />} />
          <Route path="ledger-selection" element={<SelectLedger />} />
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
}

export default App;
