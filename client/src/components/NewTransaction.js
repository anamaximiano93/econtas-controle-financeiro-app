import React from "react";

export default function NewTransaction({
  isBtnNew,
  isModalOpen,
  onModalCreate,
}) {
  const display = isModalOpen ? "none" : "block";

  const handleClickButton = () => {
    onModalCreate();
  };
  return (
    <div style={style.container_btn}>
      <button
        style={{ display: display }}
        className={"waves-effect waves-light btn"}
        disabled={!isBtnNew ? "disabled" : ""}
        onClick={handleClickButton}
      >
        Novo Lançamentos
      </button>
    </div>
  );
}
const style = {
  container_btn: {
    marginRight: "5px",
    marginLeft: "5px",
    padding: "2px",
  },
};
