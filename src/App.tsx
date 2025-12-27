import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TallyWindow from "./Pages/TallyWindow";
import SelectCompany from "./Pages/SelectCompany";
import GateWayofTally from "./Pages/GateWayofTally";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<TallyWindow />}>
            <Route index element={<GateWayofTally />} />
            <Route path="create-company" element={""} />
            <Route path="select-company" element={<SelectCompany />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
