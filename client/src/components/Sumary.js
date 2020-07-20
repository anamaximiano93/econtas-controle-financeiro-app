import React from "react";
import css from "../css/sumary.module.css";
import { formatReais } from "../helpers/format";
export default function Sumary({ sumary }) {
  let { length_, receita, despesa, saldo } = sumary;

  let color_saldo = saldo < 0 ? "#c74b2b" : "#66a085";

  receita = formatReais(parseInt(receita));
  despesa = formatReais(parseInt(despesa));
  saldo = formatReais(parseInt(saldo));

  return (
    <div className={css.flexRow}>
      <span>
        Lançamentos:
        <span>
          <strong>{" " + length_}</strong>
        </span>
      </span>
      <span>
        Receitas:
        <span style={{ color: "#66a085", fontWeight: "600" }}>
          {" " + receita}
        </span>
      </span>
      <span>
        Despesas:
        <span style={{ color: "#c74b2b", fontWeight: "600" }}>
          {" " + despesa}
        </span>
      </span>
      <span>
        Saldo:
        <span style={{ color: color_saldo, fontWeight: "600" }}>
          {" " + saldo}
        </span>
      </span>
    </div>
  );
}
