import React, { useContext } from "react";
import css from "../../styles/components/Layout/Footer.module.css";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function Footer() {
  const date = new Date();

  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className={`${css.containerFooter} ${
        theme === "dark" && css.dark
      } center`}
    >
      <div>
        <p>All rights reserved © Copyright 2020 - {date.getFullYear()}</p>
        <span> Desenvolvido com ❤ Ana Maximiano </span>
      </div>
    </footer>
  );
}
