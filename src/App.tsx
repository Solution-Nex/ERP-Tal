import { lazy } from 'react';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const Layout = lazy(()=> import('./Components/layout/Layout'));
const GateWayofTally = lazy(()=> import("./Pages/GateWayofTally"))
const SelectCompany = lazy(()=> import("./Pages/company/SelectCompany"))
const Compneycreation = lazy(()=> import("./Pages/company/Compneycreation"))
const Login = lazy(()=> import("./Pages/auth/Login"))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GateWayofTally />} />
          <Route path="/select-company" element={<SelectCompany />} />
          <Route path="/create-company" element={<Compneycreation />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
