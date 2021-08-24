import React from "react";
import css from "../../styles/components/Sumary.module.css";
import { formatReais } from "../../helpers/format";
import Receita from "../../assets/icons/revenue.png";
import Despesa from "../../assets/icons/expense.png";
import Saldo from "../../assets/icons/balance.png";

export default function Sumary({ sumary }) {
  let { length_, receita, despesa, saldo } = sumary;

  let color_saldo = saldo < receita / 2;
  let color_receita = "#a1f0dc";
  let color_despesa = "#f0a1a8";

  receita = formatReais(parseFloat(receita));
  despesa = formatReais(parseFloat(despesa));

  saldo = formatReais(parseFloat(saldo));

  return (
    <div className={css.sumaryContainer}>
      <div style={{ background: color_receita }}>
        <img src={Receita} alt="receita" />
        <span>{" " + receita}</span>
      </div>
      <div style={{ background: color_despesa }}>
        <img src={Despesa} alt="despesa" />
        <span>{" " + despesa}</span>
      </div>
      <div
        //prettier-ignore
        style={{ background: (color_saldo? "rgba(251, 36, 36, 0.862)" : "rgba(155, 247, 255, 0.862)") }}
      >
        <img src={Saldo} alt="despesa" />
        <span>{" " + saldo}</span>
      </div>
    </div>
  );
}
