import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { HelmetProvider } from 'react-helmet-async';
import LandingPage from "./components/LandingPage";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  return (
    <HelmetProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
};

export default App;