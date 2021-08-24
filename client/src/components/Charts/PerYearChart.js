import React, { useContext, useEffect, useState } from "react";
import Spinner from "../Spinner";
import api from "../../api/api";
import { ThemeContext } from "../../contexts/ThemeContext";

import css from "../../styles/components/Charts.module.css";
import { Context } from "../../contexts/AuthContext";

import Chart from "react-apexcharts";

export default function PerYearChart() {
  const [type, settype] = useState("revenue");
  const [length, setlength] = useState(0);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  const { user } = useContext(Context);
  const { theme } = useContext(ThemeContext);

  const loadDataYear = async (current) => {
    const { data } = await api.get(
      `/user/transaction/${user._id}/chart/perYear?type=${current}`
    );
    const { transaction, length } = data;

    const values = transaction.labels.map((item) => item.toString());

    setLabels(values);
    setValues(transaction.values);

    setlength(0);
    setTimeout(() => {
      setlength(length);
    }, 2000);
  };

  useEffect(() => {
    const getLoadData = async () => {
      loadDataYear(type);
    };
    getLoadData();
  }, []);

  const handleSelectType = (event) => {
    settype(event.target.value);
    loadDataYear(event.target.value);
  };

  const series = values;
  const options = {
    chart: {
      type: "donut",
    },
    labels: labels,
    title: {
      text: `Valores de ${type === "expense" ? "Despesa" : "Receita"} por Ano`,
    },

    theme: {
      mode: theme,
      palette: "palette7",
      monochrome: {
        enabled: false,
        color: "#255aee",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
  };

  return (
    <>
      <div className={css.year}>
        <label>
          <input
            name="type"
            type="radio"
            value={"revenue"}
            onChange={handleSelectType}
            checked={type === "revenue" ? true : false}
          />
          <span>Receita</span>
        </label>

        <label>
          <input
            name="type"
            type="radio"
            value={"expense"}
            onChange={handleSelectType}
            checked={type === "expense" ? true : false}
          />
          <span>Despesa</span>
        </label>
      </div>
      {length === 0 && <Spinner />}
      {length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="donut"
          height="300px"
          style={{ colors: "white" }}
        />
      ) : (
        length < 0 && <p>Não ha data</p>
      )}
    </>
  );
}
