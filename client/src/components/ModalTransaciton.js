import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { dataformatpicker } from "../helpers/datePeriod";

Modal.setAppElement("#root");

export default function ModalTransaciton(props) {
  const { onSave, onClose, selectedTransaction, whencall } = props;

  const [description_, setdescription_] = useState("");
  const [category_, setcategory_] = useState("");
  const [value_, setvalue_] = useState(0);
  const [type_, settype_] = useState("-");
  const [yearMonthDay_, setyearMonthDay_] = useState(dataformatpicker());
  const [isReadOnly, setisReadOnly] = useState(false);

  useEffect(() => {
    const {
      description,
      value,
      type,
      yearMonthDay,
      category,
    } = selectedTransaction;
    if (whencall === "update") {
      setdescription_(description);
      setcategory_(category);
      setvalue_(value);
      settype_(type);
      setyearMonthDay_(yearMonthDay);
      setisReadOnly(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose(null);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { _id } = selectedTransaction;
    const yearMonth =
      yearMonthDay_.slice(0, 4) + "-" + yearMonthDay_.slice(5, 7);
    const formData = {
      _id: typeof _id === "undefined" ? "_id" : _id,
      description: description_,
      category: category_,
      type: type_,
      value: value_,
      yearMonth: yearMonth,
      year: parseInt(yearMonthDay_.slice(0, 4)),
      day: parseInt(yearMonthDay_.slice(8, yearMonthDay_.length)),
      month: parseInt(yearMonthDay_.slice(5, 7)),
      yearMonthDay: yearMonthDay_,
    };
    onSave(formData);
    setisReadOnly(false);
  };

  const handleDescription = (event) => {
    const value = event.target.value;
    setdescription_(value);
  };
  const handleCategory = (event) => {
    const value = event.target.value;
    setcategory_(value);
  };
  const handleValue = (event) => {
    const value = event.target.value;
    setvalue_(value);
  };

  const handleDate = (event) => {
    const value = event.target.value;
    setyearMonthDay_(value);
  };
  const handleType = (event) => {
    const value = event.target.value;
    settype_(value);
  };
  const handleModalClose = () => {
    onClose(null);
    setisReadOnly(false);
  };
  return (
    <Modal
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        },
        content: {
          position: "absolute",
          top: "40px",
          left: "40px",
          right: "40px",
          bottom: "40px",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
          width: "400px",
          margin: "0 auto",
          height: "500px",
        },
      }}
      isOpen={true}
    >
      <div style={styles.flexRow}>
        <span style={styles.title}>
          {whencall === "create"
            ? "Criação de Lançamento"
            : "Edição de Lançamento"}{" "}
        </span>
        <button
          className="waves-effect waves-lights btn red dark-4"
          onClick={handleModalClose}
        >
          X
        </button>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div style={styles.content_form}>
          <div style={styles.content_radio}>
            <label style={styles.label_radio}>
              <input
                name="inputType"
                type="radio"
                checked={type_ === "-" ? true : false}
                value={"-"}
                onChange={handleType}
                disabled={isReadOnly}
              />
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "rgb(192, 57, 43)",
                }}
              >
                Despesa
              </span>
            </label>

            <label style={styles.label_radio}>
              <input
                name="inputType"
                type="radio"
                checked={type_ === "+" ? true : false}
                value={"+"}
                onChange={handleType}
                disabled={isReadOnly}
              />
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "rgb(39, 174, 96)",
                }}
              >
                Receita
              </span>
            </label>
          </div>
          <div className="input-field">
            <input
              id="inputdescription"
              type="text"
              value={description_}
              onChange={handleDescription}
            />
            <label className="active" htmlFor="inputdescription">
              Descrição
            </label>
          </div>
          <div className="input-field">
            <input
              id="category"
              type="text"
              value={category_}
              onChange={handleCategory}
            />
            <label className="active" htmlFor="category">
              Categoria
            </label>
          </div>
          <div style={styles.flexRow}>
            <div className="input-field col s6">
              <input
                id="valueMoney"
                type="number"
                step="0.01"
                value={value_}
                onChange={handleValue}
              />
              <label className="active" htmlFor="valueMoney">
                Valor
              </label>
            </div>
            <div className="input-field col s6">
              <input
                id="inputdata"
                type="date"
                value={yearMonthDay_}
                onChange={handleDate}
              />
              <label className="active" htmlFor="inputdata">
                Data
              </label>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "start",
            marginTop: "20px",
          }}
        >
          <button className="waves-effect waves-light btn">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
const styles = {
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBotton: "40px",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: "bold",
  },
  flexStart: {
    justifyContent: "flex-start",
  },
  errorMessage: {
    marginLeft: "15px",
    color: "red",
    fontWeight: "bold",
  },
  content_form: {
    border: "1px solid lightgrey",
    borderRadius: "4px",
    padding: "10px",
    marginTop: "20px",
  },
  content_radio: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "30px",
  },
  label_radio: {
    marginRight: "10px",
    marginLeft: "10px",
    padding: "20px",
  },
};
