import "./config/connection"
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StakingPage from "./components/Homepage/HomePage";
import AdminPage from "./components/Admin/Admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";





const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
        
        <Route path="/" element={<StakingPage />} />
        <Route path="/admin" element={<AdminPage />} />
    
        
      </Routes>
    </BrowserRouter>
    <ToastContainer theme="dark" position="bottom-right"/>
    </>
  );
};

export default App;
