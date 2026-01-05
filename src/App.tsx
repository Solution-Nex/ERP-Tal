
import { lazy } from 'react';
import './index.css'

// import Home from './Pages/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";


const Layout = lazy(() => import("./Components/layout/Layout"));
const GateWayofTally = lazy(() => import("./Pages/GateWayofTally"));
const SelectCompany = lazy(() => import("./Pages/company/SelectCompany"));
const Compneycreation = lazy(() => import("./Pages/company/Compneycreation"));
const LoginPage = lazy(() => import("./Pages/auth/Login"));
const LedgerCreation = lazy(() => import("./Pages/Ledger/LedgerCreation"));
const SelectLedger = lazy(() => import("./Pages/Ledger/SelectLedger"));
const Vouchertype= lazy(()=> import("./Pages/vouchers/Vouchertype"))
const Vouchercreation = lazy(()=> import("./Pages/vouchers/VoucherForm"))
const Advancevoucher = lazy(()=> import("./Pages/vouchers/Advancevoucher"))
function App() {
  return (
    <BrowserRouter>

      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GateWayofTally />}></Route>
          <Route path="/select-company" element={<SelectCompany />}></Route>
          <Route path="/create-company" element={<Compneycreation />}></Route>
          <Route path="/ledger-creation" element={<LedgerCreation />} />
          <Route path="/ledger-selection" element={<SelectLedger />} />
          <Route path='/voucher-type' element={<Vouchertype/>} />
          <Route path='/voucher-creation' element={<Vouchercreation/>} />
          <Route path='/advancevouchersetting' element={<Advancevoucher/>} />
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
      {/* </Suspense> */}

    </BrowserRouter>
  );
}

export default App;
