import React, { useContext, useEffect } from "react";

import css from "../styles/pages/Home.module.css";
import Select from "../components/Transaction/Select";
import Sumary from "../components/Transaction/Sumary";
import NewTransaction from "../components/Transaction/NewTransaction";
import Search from "../components/Transaction/Search";
import List from "../components/Transaction/List";
import ModalTransaciton from "../components/Transaction/ModalTransaciton";
import Spinner from "../components/Spinner";
import { getDefauldPeriod, getFullPeriod } from "../helpers/datePeriod";
import { useState } from "react";
import { removerAcentos } from "../helpers/format";
import api from "../api/api";
import { Context } from "../contexts/AuthContext";
import Message from "../components/Message";
import history from "../helpers/history";

export default function Home() {
  const { user, isModalOpen, setIsModalOpen, errorMessage } = useContext(
    Context
  );

  const [defauldPeriod, setdefauldPeriod] = useState(getDefauldPeriod());
  const [ListPeriod, setListPeriod] = useState([]);
  const [allistPeriod, setallistPeriod] = useState([]);
  const [SumaryPeriod, setSumaryPeriod] = useState({});
  const [lengthPeriod, setlengthPeriod] = useState(0);
  const [filterDescription, setfilterDescription] = useState("");
  const [selectTransaciton, setselectTransaciton] = useState({});
  const [isBtnNew, setisBtnNew] = useState(false);
  const [actionCall, setActionCall] = useState("");

  const loadDataList = async (currentPeriod) => {
    try {
      const data = await api.get(
        `/user/transaction/${user._id}?period=${currentPeriod}`
      );
      const {
        transaction,
        length,
        revenue,
        expense,
        balance,
      } = await data.data;

      setallistPeriod(transaction);
      setListPeriod(transaction);
      setSumaryPeriod({
        length_: length,
        receita: revenue,
        despesa: expense,
        saldo: balance,
      });
      setlengthPeriod(0);
      setTimeout(() => {
        setlengthPeriod(length);
      }, 3000);
    } catch (err) {
      const { status } = err.response;
      if (status === 401) {
        history.push("/");
      }
    }
  };

  const getSumary = (list) => {
    const revenue = list.reduce((acc, curr) => {
      if (curr.type === "+") return acc + curr.value;
      else return acc;
    }, 0);
    const expense = list.reduce((acc, curr) => {
      if (curr.type === "-") return acc + curr.value;
      else return acc;
    }, 0);

    const balance = revenue - expense;

    setSumaryPeriod({
      length_: list.length,
      receita: revenue,
      despesa: expense,
      saldo: balance,
    });
  };

  const handleChangePeriod = async (value) => {
    await loadDataList(value);
    setdefauldPeriod({ value: value });
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
    }, []);

    setListPeriod(ListPeriodFiltered);

    getSumary(ListPeriodFiltered);
  }, [filterDescription, allistPeriod]);

  const handleSearch = (value) => {
    setisBtnNew(false);
    setfilterDescription(value);
  };

  useEffect(() => {
    const getList = async () => {
      await loadDataList(defauldPeriod.value);
    };

    document.title = "Econtas - Home";

    getList();
  }, [defauldPeriod.value]);

  const handlePersistData = async (formData) => {
    const transaction = formData;
    transaction.value = parseFloat(transaction.value);

    if (actionCall === "create") {
      delete transaction._id;
      await api.post(`/user/transaction/${user._id}`, transaction);
    } else {
      const id = transaction._id;
      delete transaction._id;
      transaction.category = transaction.category.value;

      await api.put(`/user/${user._id}/transaction/${id}`, transaction);
    }

    setIsModalOpen(false);
    setActionCall("");
    loadDataList(defauldPeriod.value);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setActionCall("");
  };

  const handleModalCreate = () => {
    setActionCall("create");
    setIsModalOpen(true);
  };

  const handleModalUpdate = (transaction) => {
    setActionCall("update");
    setIsModalOpen(true);
    setselectTransaciton(transaction);
  };

  const handleDelete = async (transaction) => {
    await api.delete(`/user/${user._id}/transaction/${transaction._id}`);

    await loadDataList(defauldPeriod.value);
  };
  return (
    <div className="container center">
      <Select
        defaultValue={defauldPeriod}
        optionValues={getFullPeriod()}
        onChangeSelect={handleChangePeriod}
      />
      {lengthPeriod === 0 ? (
        <Spinner />
      ) : lengthPeriod > 0 ? (
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
            checkAllList={allistPeriod.length === ListPeriod.length}
            onUpdate={handleModalUpdate}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <div className={css.flexRow}>
          <NewTransaction
            isBtnNew={true}
            isModalOpen={isModalOpen}
            onModalCreate={handleModalCreate}
            name={"Adicionar"}
          />
          <p
            className="center"
            style={{
              textAlign: "center",
              margin: "1rem",
              marginLeft: "4.2rem",
              fontSize: "1.5rem",
              lineHeight: "30px",
            }}
          >
            NÃO HÁ LANÇAMENTOS PARA ESSE MES/ANO{" "}
            <i className="material-icons">sentiment_very_dissatisfied</i>
          </p>
        </div>
      )}

      {isModalOpen && (
        <ModalTransaciton
          actionCall={actionCall}
          onSave={handlePersistData}
          onClose={handleModalClose}
          selectedTransaction={selectTransaciton}
        />
      )}

      {errorMessage && (
        <Message message={errorMessage.message} code={errorMessage.code} />
      )}
    </div>
  );
}
