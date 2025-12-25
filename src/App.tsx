import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TallyWindow from "./Pages/TallyWindow";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<TallyWindow />}>
            <Route path="create-company" element={""} />
            <Route path="select-company" element={""} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
