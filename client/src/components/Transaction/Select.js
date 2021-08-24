import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import css from "../../styles/components/Select.module.css";

export default function Select({ defaultValue, optionValues, onChangeSelect }) {
  const [fullPeriodIndex, setfullPeriodIndex] = useState(0);

  const { theme } = useContext(ThemeContext);

  const handleSelectChange = (event) => {
    onChangeSelect(event.target.value);
  };

  const handleOnClickSelect = (index) => {
    const nextPeriod = optionValues[fullPeriodIndex + index].value;

    onChangeSelect(nextPeriod);
  };

  useEffect(() => {
    const indexPeriod = optionValues.findIndex(
      ({ value }) => value === defaultValue.value
    );

    setfullPeriodIndex(indexPeriod);
  }, [defaultValue]);

  return (
    <div className={`${css.selectContainer} ${theme === "dark" && css.dark}`}>
      <button
        onClick={() => handleOnClickSelect(-1)}
        disabled={fullPeriodIndex === 0 && true}
      >
        <i className="material-icons">navigate_before</i>
      </button>
      <select
        value={defaultValue.value}
        onChange={handleSelectChange}
        style={{
          textAlign: "center !important",
        }}
      >
        {optionValues.map((item, index) => {
          return (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
      <button
        onClick={() => handleOnClickSelect(1)}
        disabled={fullPeriodIndex === optionValues.length - 1 && true}
      >
        <i className="material-icons">navigate_next</i>
      </button>
    </div>
  );
}
