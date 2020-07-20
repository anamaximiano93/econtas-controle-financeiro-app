import React from "react";
import css from "../css/select.module.css";

export default function Select({ defaultValue, optionsValue, onChangeSelect }) {
  const handleSelectChange = (event) => {
    onChangeSelect(event.target.value);
  };
  return (
    <div className={css.flexRow}>
      <select value={defaultValue.value} onChange={handleSelectChange}>
        {optionsValue.map((item, index) => {
          return defaultValue.value === item.value ? (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ) : (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
