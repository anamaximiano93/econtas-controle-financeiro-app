import React from "react";

export default function Action({ id, type, onActionClick }) {
  const handleIconClick = () => {
    onActionClick(id, type);
  };

  return (
    <i
      className="material-icons"
      onClick={handleIconClick}
      style={{ cursor: "pointer" }}
    >
      {type}
    </i>
  );
}
