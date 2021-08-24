import React, { useContext } from "react";

import css from "../../styles/components/Add.module.css";

import { ThemeContext } from "../../contexts/ThemeContext";

export default function NewTransaction({
  isBtnNew,
  isModalOpen,
  onModalCreate,
  name = "",
}) {
  const display = isModalOpen && "none";

  const { theme } = useContext(ThemeContext);

  const handleClickButton = () => {
    onModalCreate();
  };
  return (
    <div className={`${css.addContainer} ${theme === "dark" && css.dark}`}>
      <button
        style={{ display: display }}
        className="waves-effect waves-light btn"
        onClick={handleClickButton}
      >
        {name}
        <i className="material-icons center">add_circle_outline</i>
      </button>
    </div>
  );
}
