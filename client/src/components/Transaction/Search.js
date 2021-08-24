import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

import css from "../../styles/components/Search.module.css";

export default function Search({ onSearch, filterDescription }) {
  const { theme } = useContext(ThemeContext);
  const handleInputSearch = (event) => {
    let value = event.target.value;
    onSearch(value);
  };

  return (
    <div className={`${css.searchContainer} ${theme === "dark" && css.dark}`}>
      <input
        type="text"
        placeholder=" Buscar pela descrição"
        onChange={handleInputSearch}
        value={filterDescription}
      />
    </div>
  );
}
