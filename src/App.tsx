import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ContactUs from "./pages/ContactUs/ContactUs";
import WorkWithUs from "./pages/WorkWithUs/WorkWithUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import PrivateRoute from "./components/PrivateRoute/ProvateRoute";
import { useAuthStore } from './store/useAuthStore';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/workWithUs" element={<WorkWithUs />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="*" element={<NotFoundPage />} />
        <PrivateRoute path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
