import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import "./styles/globals.scss";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ContactUs from "./pages/ContactUs/ContactUs";
import WorkWithUs from "./pages/WorkWithUs/WorkWithUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import LoginForm from "./components/LoginForm/LoginForm";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/tjänster" element={<Services />} />
          <Route path="/kontaktaOss" element={<ContactUs />} />
          <Route path="/jobbaMedOss" element={<WorkWithUs />} />
          <Route path="/omOss" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={<LoginForm />} />

        <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
