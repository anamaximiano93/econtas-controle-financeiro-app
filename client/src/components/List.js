import React from "react";

import css from "../css/list.module.css";
import ListItem from "./ListItem";

export default function List({ datalist, onUpdate, onDelete }) {
  const handleActionClick = (_id, type) => {
    const transiction = datalist.find((item) => item._id === _id);

    if (type === "delete") {
      onDelete(transiction);
      return;
    }
    onUpdate(transiction);
  };

  return (
    <div className={css.container_list}>
      {datalist.map((item, index) => {
        return (
          <ListItem
            listItem={item}
            index={index}
            onActionClickItem={handleActionClick}
          />
        );
      })}
    </div>
  );
}
