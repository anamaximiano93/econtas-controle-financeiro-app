import React, { useState, useEffect } from "react";

import css from "./App.module.css";
import Select from "./components/Select";
import Sumary from "./components/Sumary";
import NewTransaction from "./components/NewTransaction";
import Search from "./components/Search";
import List from "./components/List";
import api from "./api/api";
import { getDefauldPeriod, getFullPeriod } from "./helpers/datePeriod";
import { removerAcentos } from "./helpers/format"; //
import ModalTransaciton from "./components/ModalTransaciton";
import Spinner from "./components/Spinner";

export default function App() {
  const [defauldPeriod, setdefauldPeriod] = useState(getDefauldPeriod());
  const [ListPeriod, setListPeriod] = useState([]);
  const [allistPeriod, setallistPeriod] = useState([]);
  const [SumaryPeriod, setSumaryPeriod] = useState({});
  const [lengthPeriod, setlengthPeriod] = useState(0);
  const [filterDescription, setfilterDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectTransaciton, setselectTransaciton] = useState({});
  const [isBtnNew, setisBtnNew] = useState(false);
  const [whenCall, setwhenCall] = useState("");

  const loadDataList = async (currentPeriod) => {
    const data = await api.get(`/?period=${currentPeriod}`);
    const { transaction, length } = await data.data.result;

    setTimeout(() => {
      setallistPeriod(transaction);
      setListPeriod(transaction);
      setlengthPeriod(length);
      getSumary(transaction);
    }, 500);
  };

  const getSumary = (list) => {
    const receita = list.reduce((acc, curr) => {
      if (curr.type === "+") return acc + curr.value;
      else return acc;
    }, 0);
    const despesa = list.reduce((acc, curr) => {
      if (curr.type === "-") return acc + curr.value;
      else return acc;
    }, 0);

    const saldo = receita - despesa;

    setSumaryPeriod({
      length_: list.length,
      receita,
      despesa,
      saldo,
    });
  };

  const handleChangePeriod = async (value) => {
    setdefauldPeriod({ value: value });
    setlengthPeriod(0);
    await loadDataList(value);

    setlengthPeriod(ListPeriod.length);
    getSumary(ListPeriod);
  };

  useEffect(() => {
    const filterLowerCase = removerAcentos(filterDescription.toLowerCase());

    const AuxListPeriod = [...allistPeriod];

    const ListPeriodFiltered = AuxListPeriod.filter((item) => {
      const value = removerAcentos(item.description);
      if (filterLowerCase.length === 0) {
        setisBtnNew(true);
        return allistPeriod;
      } else {
        return value.toLowerCase().includes(filterLowerCase);
      }
    });

    setListPeriod(ListPeriodFiltered);
    setlengthPeriod(ListPeriodFiltered.length);
    getSumary(ListPeriodFiltered);
  }, [filterDescription, allistPeriod]);

  const handleSearch = (value) => {
    setisBtnNew(false);
    setfilterDescription(value);
  };

  useEffect(() => {
    const getList = () => {
      loadDataList(defauldPeriod.value);
    };
    getList();
  }, []);

  const handlePersistData = async (formData) => {
    const transaction = formData;
    transaction.value = parseFloat(transaction.value);

    if (whenCall === "create") {
      delete transaction._id;
      await api.post("/", transaction);
    } else {
      await api.put(`/${transaction._id}`, transaction);
    }

    setIsModalOpen(false);
    setwhenCall("");
    loadDataList(defauldPeriod.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setwhenCall("");
  };

  const handleModalCreate = () => {
    setwhenCall("create");
    setIsModalOpen(true);
  };

  const handleModalUpdate = (transaction) => {
    setwhenCall("update");
    setIsModalOpen(true);
    setselectTransaciton(transaction);
  };

  const handleDelete = async (transaction) => {
    await api.delete("/" + transaction._id);
    loadDataList(defauldPeriod.value);
  };

  return (
    <div className={"center container"}>
      <div>
        <h1 style={{ fontWeight: "bold", fontSize: "3.0rem" }}>
          Desafio Final Bootcamp DFS
        </h1>
        <h3
          style={{
            fontWeight: "500",
            fontStyle: "italic",
            fontSize: "2.2rem",
            fontFamily: "Roboto Mono,monospace",
          }}
        >
          Econtas
        </h3>
      </div>
      <Select
        defaultValue={defauldPeriod}
        optionsValue={getFullPeriod()}
        onChangeSelect={handleChangePeriod}
      />
      {lengthPeriod === 0 && <Spinner />}
      {lengthPeriod > 0 && (
        <div>
          <Sumary sumary={SumaryPeriod} />
          <div className={css.flexRow}>
            <NewTransaction
              isBtnNew={isBtnNew}
              isModalOpen={isModalOpen}
              onModalCreate={handleModalCreate}
            />
            <Search
              onSearch={handleSearch}
              filterDescription={filterDescription}
            />
          </div>

          <List
            datalist={ListPeriod}
            onUpdate={handleModalUpdate}
            onDelete={handleDelete}
          />
        </div>
      )}
      {isModalOpen && (
        <ModalTransaciton
          whencall={whenCall}
          onSave={handlePersistData}
          onClose={handleModalClose}
          selectedTransaction={selectTransaciton}
        />
      )}
    </div>
  );
}
