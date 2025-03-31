import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./home";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Submission from "./submission";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Submission" element={<Submission />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
