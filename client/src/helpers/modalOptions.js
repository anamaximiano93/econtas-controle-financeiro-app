import React from "react";
import { components } from "react-select";

import chroma from "chroma-js";
const optionsCategory = [
  {
    label: "Alimentação",
    value: "Alimentação",
    icon: "restaurant",
    color: "00916E",
  },
  {
    label: "Assinaturas e serviços",
    value: "Assinaturas e serviços",
    icon: "card_membership",
    color: "FFCF00",
  },
  {
    label: "Bares e restaurantes",
    value: "Bares e restaurantes",
    icon: "local_bar",
    color: "EE6123",
  },
  {
    label: "Casa",
    value: "Casa",
    icon: "home",
    color: "FA003F",
  },
  {
    label: "Compras",
    value: "Compras",
    icon: "local_mall",
    color: "7A7265",
  },
  {
    label: "Cuidados pessoais",
    value: "Cuidados pessoais",
    icon: "person",
    color: "A8D5E2",
  },
  {
    label: "Dívidas e empréstimos",
    value: "Dívidas e empréstimos",
    icon: "receipt",
    color: "FB3640",
  },
  {
    label: "Educação",
    value: "Educação",
    icon: "school",
    color: "1D3461",
  },
  {
    label: "Familia e filhos",
    value: "Familia e filhos",
    icon: "favorite",
    color: "FF8700",
  },
  {
    label: "Impostos e taxas",
    value: "Impostos e taxas",
    icon: "insert_drive_file",
    color: "8338EC",
  },
  {
    label: "Investimentos",
    value: "Investimentos",
    icon: "insert_chart",
    color: "564D4A",
  },
  {
    label: "Lazer e hobbies",
    value: "Lazer e hobbies",
    icon: "insert_emoticon",
    color: "AB4967",
  },
  {
    label: "Mercado",
    value: "Mercado",
    icon: "shopping_cart",
    color: "4ECDC4",
  },
  {
    label: "Outros",
    value: "Outros",
    icon: "view_list",
    color: "BCB8B1",
  },
  {
    label: "Pets",
    value: "Pets",
    icon: "pets",
    color: "669BBC",
  },
  {
    label: "Presentes e doações",
    value: "Presentes e doações",
    icon: "card_giftcard",
    color: "E4572E",
  },
  {
    label: "Receita",
    value: "Receita",
    icon: "monetization_on",
    color: "38B000",
  },
  {
    label: "Roupas",
    value: "Roupas",
    icon: "loyalty",
    color: "FF006E",
  },
  {
    label: "Saúde",
    value: "Saúde",
    icon: "local_hospital",
    color: "00E8FC",
  },
  {
    label: "Trabalho",
    value: "Trabalho",
    icon: "work",
    color: "29274C",
  },
  {
    label: "Transporte",
    value: "Transporte",
    icon: "time_to_leave",
    color: "B5C9C3",
  },
  {
    label: "Viagem",
    value: "Viagem",
    icon: "local_airport",
    color: "DD2D4A",
  },
];

const { Option } = components;

const IconOption = (props) => (
  <Option {...props}>
    <i
      className="material-icons circle"
      style={{
        background: `#${props.data.color}`,
        padding: "7px",
        borderRadius: "50%",
        lineHeight: "auto",
        marginRight: "5px",
        boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.63)",
        color: "#fff",
        fontSize: "1.1rem",
      }}
    >
      {props.data.icon}
    </i>
    {props.data.label}
  </Option>
);

const dot = (color = "#ccc") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: "''",
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles = {
  indicatorSeparator: (styles, state) => ({
    ...styles,
    padding: 0,
  }),

  menuList: (styles, state) => {
    return {
      ...styles,
      height: "100px",
    };
  },
  valueContainer: (styles, state) => {
    return {
      ...styles,
      height: state.selectProps.height,
    };
  },
  control: (styles, state) => {
    return {
      ...styles,
      backgroundColor: "white",
      fontSize: "1.28rem",
      margin: "5px",
    };
  },
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    //console.log(data);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? `#${data.color}`
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : null,

      fontSize: "1.28rem",

      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        fontSize: "1.28rem",
        backgroundColor:
          !isDisabled &&
          (isSelected ? `#${data.color}` : color.alpha(0.3).css()),
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot() }),
  singleValue: (styles, { data }) => ({
    ...styles,
    padding: "1px",
    ...dot(`#${data.color}`),
  }),
};

export { optionsCategory, colourStyles, IconOption };
