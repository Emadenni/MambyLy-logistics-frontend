import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ContactUs from "./pages/ContactUs/ContactUs";
import WorkWithUs from "./pages/WorkWithUs/WorkWithUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Layout from "./components/Layout/Layout";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/workWithUs" element={<WorkWithUs />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

      
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
