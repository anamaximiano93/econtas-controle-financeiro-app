import React, { useContext, useEffect, useState } from "react";
import Select from "../Transaction/Select";
import Spinner from "../Spinner";
import api from "../../api/api";

import { getDefauldPeriod, getFullPeriod } from "../../helpers/datePeriod";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Context } from "../../contexts/AuthContext";

import Chart from "react-apexcharts";

const FULL_DATA_PERIOD = getFullPeriod();

export default function CategoriaChart() {
  const [period, setPeriod] = useState(getDefauldPeriod());
  const [length, setlength] = useState(0);

  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  const { user } = useContext(Context);

  const { theme } = useContext(ThemeContext);
  const loadCategories = async (current) => {
    const { data } = await api.get(
      `/user/transaction/${user._id}/chart/categories?period=${current}`
    );

    const { transaction, length } = data.result;
    console.log(transaction, length);

    setLabels(transaction.labels);
    setValues(transaction.values);

    setlength(0);
    setTimeout(() => {
      setlength(length);
    }, 2000);
  };

  useEffect(() => {
    const getCategories = async () => {
      loadCategories(period.value);
    };
    getCategories();
  }, []);

  const handleSelectChat = async (value) => {
    setPeriod({ value: value });
    await loadCategories(value);
  };

  const series = values;
  const options = {
    chart: {
      type: "pie",
    },
    labels: labels,
    title: {
      text: `Despesa por Categoria em Mês/Ano`,
    },
    theme: {
      mode: theme,
      palette: "palette2",
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
      <Select
        optionValues={FULL_DATA_PERIOD}
        onChangeSelect={handleSelectChat}
        defaultValue={period}
      />
      {length === 0 && <Spinner />}
      {length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="pie"
          height="300px"
          style={{ colors: "white" }}
        />
      ) : (
        length < 0 && <p>Não ha data</p>
      )}
    </>
  );
}
