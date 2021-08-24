import React, { useContext, useEffect, useState } from "react";
import Message from "../components/Message";
import { Context } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import api from "../api/api";

import css from "../styles/pages/Perfil.module.css";

export default function Perfil() {
  const { theme } = useContext(ThemeContext);
  const { user: userContext, errorMessage, setErrorMessage } = useContext(
    Context
  );

  const [email_, setEmail] = useState("");
  const [avatar_, setAvatar] = useState("");
  const [name_, setName] = useState("");
  const [transactions_, setTransactions] = useState("");

  useEffect(() => {
    const getUser = async () => {
      document.title = "Econtas - Perfil";
      try {
        const { data } = await api.get(`/user/${userContext._id}`);

        const { user } = data;
        const { email, name, avatar = null, transactions } = user;

        setEmail(email);
        setName(name);
        setAvatar(avatar);
        setTransactions(transactions.length);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, []);

  const handleUpdatePerfil = async () => {
    if (email_ === "" || name_ === "") {
      setErrorMessage({
        message: "Todos os campos devem ser preenchidos!",
        code: 100,
      });
      return;
    }

    try {
      const { data } = await api.put(`/user/${userContext._id}`, {
        email: email_,
        name: name_,
      });

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`${css.boxContainer} ${theme === "dark" && css.dark}`}>
      <div className={`${css.formContainer} ${theme === "dark" && css.dark}`}>
        <h2>Perfil</h2>
        <form>
          {/* <div className="avatar center">
            <img
              src={!avatar_ && loginImg}
              alt={` avatar ${name_}`}
              className="circle"
              width="75px"
              style={{
                color: theme === "dark" ? "#f7fff7 !important" : "",
                background: theme === "dark" ? "#f7fff7 !important" : "",
              }}
            />
          </div> */}
          {/* <div>
            <label htmlFor={"name"}>Avatar</label>
            <input
              type="text"
              placeholder="Link da imagem"
              id="avatar"
              className="z-depth-5"
              name="name"
              required
              value={avatar_}
              onChange={() => {
                setAvatar(avatar_);
              }}
            />
          </div> */}
          <div className="input-field">
            <input
              type="text"
              id="name"
              className="z-depth-5"
              name="name"
              required
              value={name_}
              onChange={(event) => {
                setErrorMessage(null);
                setName(event.target.value);
              }}
            />
            <label className="active" htmlFor={"name"}>
              Name
            </label>
          </div>
          <div className="input-field">
            <input
              type="email"
              id={"email"}
              className="z-depth-5"
              name="email"
              required
              value={email_}
              onChange={(event) => {
                setErrorMessage(null);
                setEmail(event.target.value);
              }}
            />
            <label className="active" htmlFor={"email"}>
              E-mail
            </label>
          </div>
        </form>
        <span>Quatidade de Transações Efetuadas: {transactions_}</span>

        <button onClick={handleUpdatePerfil} type="submit">
          Atualizar Perfil
        </button>
        {/*  <span>
          <a onClick={() => window.history.back()}>Voltar</a>
        </span> */}
      </div>

      {errorMessage && (
        <Message message={errorMessage.message} code={errorMessage.code} />
      )}
    </div>
  );
}
