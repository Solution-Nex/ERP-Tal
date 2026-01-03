import { lazy } from 'react';
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
//pages
const Layout = lazy(() => import("./Components/layout/Layout"));
const GateWayofTally = lazy(() => import("./Pages/GateWayofTally"));
const SelectCompany = lazy(() => import("./Pages/company/SelectCompany"));
const Compneycreation = lazy(() => import("./Pages/company/Compneycreation"));
const LoginPage = lazy(() => import("./Pages/auth/Login"));
const LedgerCreation = lazy(() => import("./Pages/Ledger/LedgerCreation"));
const SelectLedger = lazy(() => import("./Pages/Ledger/SelectLedger"));
const VoucherForm = lazy(()=>import("./Pages/vouchers/VoucherForm"))
const VoucherList = lazy(()=>import("./Pages/vouchers/VoucherList"))
const NotFound = lazy(() => import("./Pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GateWayofTally />}></Route>
          <Route path="/select-company" element={<SelectCompany />}></Route>
          <Route path="/create-company" element={<Compneycreation />}></Route>
          <Route path="/accounts/new-ledger" element={<LedgerCreation />} />
          <Route path="/accounts/ledgers" element={<SelectLedger />} />
          <Route path="/vouchers/new" element={<VoucherForm />} />
          <Route path="/vouchers" element={<VoucherList />} />
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
}

export default App;
