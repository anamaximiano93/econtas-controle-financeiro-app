import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { dataformatpicker } from "../../helpers/datePeriod";
import M from "materialize-css";
import Select, { components } from "react-select";
import chroma from "chroma-js";

import { ThemeContext } from "../../contexts/ThemeContext";

import css from "../../styles/components/Modal.module.css";
import {
  optionsCategory,
  IconOption,
  colourStyles,
} from "../../helpers/modalOptions";
import { Context } from "../../contexts/AuthContext";
Modal.setAppElement("#root");

export default function ModalTransaciton(props) {
  const { onSave, onClose, selectedTransaction, actionCall } = props;

  const { theme } = useContext(ThemeContext);
  const { setErrorMessage } = useContext(Context);

  const [description_, setDescription_] = useState("");
  const [category_, setCategory_] = useState("");
  const [value_, setValue_] = useState(0);
  const [type_, setType_] = useState("");
  const [yearMonthDay_, setYearMonthDay_] = useState(dataformatpicker());
  const [isReadOnly, setIsReadOnly] = useState(false);

  useEffect(() => {
    const {
      description,
      value,
      type,
      yearMonthDay,
      category,
    } = selectedTransaction;
    if (actionCall === "update") {
      const valueCategory_ = optionsCategory.find(
        (item) => item.value === category
      );

      setDescription_(description);
      setCategory_(valueCategory_);
      setValue_(value);
      setType_(type);
      setYearMonthDay_(yearMonthDay);
      setIsReadOnly(true);
    }
  }, []);

  useEffect(() => {
    //M.FormSelect.init(document.querySelectorAll("select"));
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
    setErrorMessage(null);
    /*   if (validadeFormData()) {
      setErrorMessage({ message: "Favor Preencher os campos!", code: 401 });
      return;
    } */

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
    setIsReadOnly(false);
    //cleanValuesModal();
  };

  const handleDescription = (event) => {
    const value = event.target.value;
    setDescription_(value);
  };
  const handleCategory = (event) => {
    const value = event.value;
    setCategory_(value);
  };
  const handleValue = (event) => {
    const value = event.target.value;
    setValue_(value);
  };

  const handleDate = (event) => {
    const value = event.target.value;
    setYearMonthDay_(value);
  };
  const handleType = (event) => {
    const value = event.target.value;
    setType_(value);
  };
  const handleModalClose = () => {
    onClose(null);
    setIsReadOnly(false);
  };

  const cleanValuesModal = () => {
    setType_("");
    setDescription_("");
    setCategory_("");
    setValue_(0);
    setYearMonthDay_(dataformatpicker());
  };

  return (
    <Modal
      style={{
        overlay: {
          position: "fixed",
          backgroundColor:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.75)"
              : "rgba(0, 0, 0, 0.75)",
          zIndex: 9999999,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          background: theme === "dark" ? " rgba(37, 39, 43, 0.918)" : "#f7fff7",
          /*   height: "auto",
          WebkitOverflowScrolling: "touch", */
        },
        /*  overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          zIndex: 99,
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
        }, */
      }}
      isOpen={true}
    >
      <header className={`${css.modalHeader} ${theme === "dark" && css.dark}`}>
        <span>
          {actionCall === "create"
            ? "Adicionar Lançamento"
            : "Editar Lançamento"}
        </span>
        <button
          className="waves-effect waves-lights btn red dark-4"
          onClick={handleModalClose}
        >
          X
        </button>
      </header>
      <form
        className={`${css.form} ${theme === "dark" && css.dark}`}
        onSubmit={handleFormSubmit}
      >
        <div
          className={css.containerInputType}
          style={{
            boxShadow: `0 5px 5px 0 ${
              type_ === ""
                ? "none"
                : type_ === "+"
                ? "rgba(11,218,28,0.76)"
                : "rgba(246,25,13,0.91)"
            },0 0 1px -2px ${
              type_ === ""
                ? "none"
                : type_ === "+"
                ? "rgba(11,218,28,0.76)"
                : "rgba(246,25,13,0.91)"
            }`,
          }}
        >
          <label>
            <input
              name="inputType"
              type="radio"
              checked={type_ === "+" ? true : false}
              value={"+"}
              onChange={handleType}
              disabled={isReadOnly}
            />
            <span>Receita</span>
          </label>
          <label>
            <input
              name="inputType"
              type="radio"
              checked={type_ === "-" ? true : false}
              value={"-"}
              onChange={handleType}
              disabled={isReadOnly}
            />
            <span>Despesa</span>
          </label>
        </div>
        <div className={`input-field ${css.containerDescription}`}>
          <input
            id="inputdescription"
            type="text"
            value={description_}
            onChange={handleDescription}
          />
          <label
            className={`${description_ !== "" && "active"}`}
            htmlFor="inputdescription"
          >
            Descrição
          </label>
        </div>
        <div>
          <label htmlFor="category">Categoria</label>
          <Select
            defaultValue={category_}
            placeholder="Escolha uma categoria"
            options={optionsCategory}
            components={{ Option: IconOption }}
            styles={colourStyles}
            onChange={handleCategory}
          />
        </div>
        <div className={css.valueDate}>
          <div className="input-field col s6">
            <input
              id="valueMoney"
              type="number"
              step="0.50"
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
            <label htmlFor="inputdata">Data</label>
          </div>
        </div>
        <div className={`${css.buttonSave} ${theme === "dark" && css.dark}`}>
          <button>Salvar</button>
        </div>
      </form>
    </Modal>
  );
}
