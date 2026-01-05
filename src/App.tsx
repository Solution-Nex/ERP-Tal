import { lazy } from 'react';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const Layout = lazy(() => import('./Components/layout/Layout'));
const GateWayofTally = lazy(() => import("./Pages/GateWayofTally"))
const SelectCompany = lazy(() => import("./Pages/company/SelectCompany"))
const Compneycreation = lazy(() => import("./Pages/company/Compneycreation"))
const Groups = lazy(() => import("./Pages/group/Groups"))
const Singlegroupcreation = lazy(() => import("./Pages/group/singlegroup/Singlegroupcreation"))
const Multiplegroupcreate = lazy(() => import("./Pages/group/multiplegroups/multiplegroupcreate"))
const Grouplists = lazy(()=> import("./Components/common/Groupslist"))

const Login = lazy(() => import("./Pages/auth/Login"))


function App() {
  return (
    <BrowserRouter>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<GateWayofTally />} />
          <Route path="/select-company" element={<SelectCompany />} />
          <Route path="/create-company" element={<Compneycreation />} />
          <Route path='/groups' element={<Groups />} />
          <Route path='/create-single-group' element={<Singlegroupcreation />} />
          <Route path='/create-multiple-groups' element={<Multiplegroupcreate />} />
          <Route path='/select-group' element={<Grouplists/>} />

        </Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      {/* </Suspense> */}
    </BrowserRouter>
  );
}

export default App;
