import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode; 
  }

  const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
