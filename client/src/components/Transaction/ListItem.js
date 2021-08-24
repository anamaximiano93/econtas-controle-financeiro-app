import React from "react";
import Action from "./Action";
import css from "../../styles/components/List.module.css";
import { formatReais } from "../../helpers/format";

var aux_day = 1;

export default function ListItem({
  listItem,
  onActionClickItem,
  refKey,
  theme,
}) {
  const { _id, description, value, category, day, type } = listItem;

  let styles_ = type === "+" ? "#a1f0dc" : "#f0a1a8";
  let margin_ = "";

  if (aux_day !== day) {
    margin_ = "15px";
    aux_day = day;
  }
  const handleActionClickItem = (_id, type) => {
    onActionClickItem(_id, type);
  };

  return (
    <div
      ref={refKey}
      className={`${css.listItemContainer} ${theme === "dark" && css.dark}`}
      style={{ backgroundColor: styles_, marginTop: margin_ }}
    >
      <div className={css.listPartOne}>
        <span>{parseInt(day).toString().length === 1 ? "0" + day : day}</span>
        <div>
          <li>{category}</li>
          <li>{description}</li>
        </div>
      </div>
      <div className={css.listPartTwo}>
        <span>{formatReais(value)}</span>
        <div>
          <Action
            onActionClick={handleActionClickItem}
            id={_id}
            type={"edit"}
          />

          <Action
            onActionClick={handleActionClickItem}
            id={_id}
            type="delete"
          />
        </div>
      </div>
    </div>
  );
}
