import React, { useContext, useEffect, useState } from "react";
import Select from "../Transaction/Select";
import Spinner from "../Spinner";
import api from "../../api/api";

import { getFullYearPeriod, getDefauldYear } from "../../helpers/datePeriod";
import { ThemeContext } from "../../contexts/ThemeContext";

import Chart from "react-apexcharts";

import { Context } from "../../contexts/AuthContext";

const FULL_YEAR_PERIOD = getFullYearPeriod();

export default function PerYearMonthChart() {
  const [years, setYears] = useState(getDefauldYear());
  const [Categories, setCategories] = useState([]);
  const [SerieOne, setSerieOne] = useState([]);
  const [SerieTwo, setSerieTwo] = useState([]);
  const [SerieTree, setSerieTree] = useState([]);

  const [length, setlength] = useState(0);
  const { user } = useContext(Context);
  const { theme } = useContext(ThemeContext);
  const loadDataYearMonth = async (current) => {
    const { data } = await api.get(
      `/user/transaction/${user._id}/chart/perYearMonth?year=${current}`
    );
    const { transaction, length } = data;

    setCategories(transaction.categoria);
    setSerieOne(transaction.receita);
    setSerieTwo(transaction.despesa);
    setSerieTree(transaction.saldo);

    setlength(0);
    setTimeout(() => {
      setlength(length);
    }, 2000);
  };

  useEffect(() => {
    const getLoadData = async () => {
      loadDataYearMonth(years.value);
    };
    getLoadData();
  }, []);

  const handleSelectChat = async (value) => {
    setYears({ value: value });
    await loadDataYearMonth(value);
  };

  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: Categories,
    },
    colors: ["#a1f0dc", "#f0a1a8", "#a8f7fe"],
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
  const series = [
    {
      name: "Receita",
      data: SerieOne,
    },
    {
      name: "Despesa",
      data: SerieTwo,
    },
    {
      name: "Saldo",
      data: SerieTree,
    },
  ];

  return (
    <>
      <Select
        optionValues={FULL_YEAR_PERIOD}
        onChangeSelect={handleSelectChat}
        defaultValue={years}
      />
      {length === 0 && <Spinner />}
      {length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="bar"
          height="300px"
          style={{ colors: "white" }}
        />
      ) : (
        length < 0 && <p>Não ha data</p>
      )}
    </>
  );
}
