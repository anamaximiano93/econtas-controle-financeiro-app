import React, { useContext } from "react";
import Footer from "./Footer";
import Header from "./Header";

import css from "../../styles/components/Main.module.css";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function Layout({ children }) {
  const { theme } = useContext(ThemeContext);
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Header />
      <main className={`${css.mainContainer} ${theme === "dark" && css.dark}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
