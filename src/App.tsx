import { lazy } from 'react';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './Pages/NotFound';
const Layout = lazy(() => import('./Components/layout/Layout'));
const GateWayofTally = lazy(() => import("./Pages/GateWayofTally"))
const SelectCompany = lazy(() => import("./Pages/company/SelectCompany"))
const Compneycreation = lazy(() => import("./Pages/company/Compneycreation"))
// const Groups = lazy(() => import("./Pages/group/Groups"))
const Singlegroupcreation = lazy(() => import("./Pages/group/singlegroup/Singlegroupcreation"))
const Multiplegroupcreate = lazy(() => import("./Pages/group/multiplegroups/multiplegroupcreate"))
const Grouplists = lazy(()=> import("./Components/common/Groupslist"))

const LoginPage = lazy(() => import("./Pages/auth/Login"));
const LedgerCreation = lazy(() => import("./Pages/Ledger/LedgerCreation"));
const SelectLedger = lazy(() => import("./Pages/Ledger/SelectLedger"));
// const Vouchertype= lazy(()=> import("./Pages/vouchers/Vouchertype"))
const VoucherForm = lazy(()=> import("./Pages/vouchers/VoucherForm"));
const SelectVoucher = lazy(()=> import("./Pages/vouchers/SelectVoucher"))
const Advancevoucher = lazy(()=> import("./Pages/vouchers/Advancevoucher"))
const Paymentvoucher = lazy(()=> import("./Pages/vouchers/accountingvoucher/paymentvoucher"))
const Contravoucher = lazy(()=> import("./Pages/vouchers/accountingvoucher/Contravoucher"))
const Reciptvoucher = lazy(()=> import("./Pages/vouchers/accountingvoucher/Reciptvoucher"))
const Journalvoucher = lazy(()=> import("./Pages/vouchers/accountingvoucher/journalvoucher"))
const Salesvoucher = lazy(()=> import("./Pages/vouchers/accountingvoucher/Salevoucher"))
const Salespartydetail = lazy(()=> import("./Pages/vouchers/accountingvoucher/Salespartydetail"))
const Purchasevoucher = lazy(()=> import("./Pages/vouchers/accountingvoucher/Purchasevoucher"))
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GateWayofTally />}></Route>
          <Route path="/select-company" element={<SelectCompany />}></Route>
          <Route path="/create-company" element={<Compneycreation />}></Route>
          <Route path="/accounts/new-ledger" element={<LedgerCreation />} />
          <Route path="/accounts/ledgers" element={<SelectLedger />} />
          {/* <Route path="/voucher-type" element={<Vouchertype />} /> */}
          <Route path="/voucher-creation" element={<VoucherForm />} />
          <Route path="/select-voucher-type" element={<SelectVoucher />} />
          <Route path="/advancevouchersetting" element={<Advancevoucher />} />
          <Route path="/advance-voucher-setting" element={<Advancevoucher />} />
          {/* <Route path='/groups' element={<Groups />} /> */}
          <Route path="/create-single-group" element={<Singlegroupcreation />}/>
          <Route path="/create-multiple-groups" element={<Multiplegroupcreate />}/>
          <Route path="/select-group" element={<Grouplists />} />
          <Route path="/payment-accounting-voucher" element={<Paymentvoucher />} />
          <Route path="/contra-accounting-voucher" element={<Contravoucher />} />
          <Route path="/recipt-accounting-voucher" element={<Reciptvoucher />}/>
          <Route path="/journal-accounting-voucher" element={<Journalvoucher />}/>
          <Route path="/sales-accounting-voucher" element={<Salesvoucher />}/>
          <Route path="/sales-party-detail" element={<Salespartydetail />}/>
          <Route path="/purchase-accounting-voucher" element={<Purchasevoucher />}/>
        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
