import React from "react";
import TallyWindow from "./Components/Pages/TallyWindow";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<TallyWindow />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
