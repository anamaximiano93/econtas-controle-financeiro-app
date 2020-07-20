import React from "react";
import Action from "./Action";
import css from "../css/list.module.css";
import { formatReais } from "../helpers/format";

export default function ListItem({ listItem, index, onActionClickItem }) {
  const { _id, description, value, category, day, type } = listItem;
  let aux_day = 1;
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
      key={index}
      className={css.flexRow}
      style={{ backgroundColor: styles_, marginTop: margin_ }}
    >
      <div className={css.flexRowItem} style={{ justifyContent: "flex-start" }}>
        <span className={css.number_day}>
          {parseInt(day).toString().length === 1 ? "0" + day : day}
        </span>
        <div className={css.label_}>
          <li
            className={css.label_Item}
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
          >
            {category}
          </li>
          <li className={css.label_Item} style={{ fontSize: "1.2rem" }}>
            {description}
          </li>
        </div>
      </div>
      <div className={css.flexRowItem} style={{ justifyContent: "flex-end" }}>
        <span className={css.money}>{formatReais(value)}</span>
        <div className={css.container_icons}>
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
