import React, { useContext, useEffect, useState } from "react";
import css from "../styles/pages/FormUser.module.css";
import api from "../api/api";
import { Context } from "../contexts/AuthContext";
import Message from "../components/Message";
import { ThemeContext } from "../contexts/ThemeContext";
import LogoLight from "../assets/image/logo-light.png";
import LogoDark from "../assets/image/logo-dark.png";

export default function Register() {
  const [nameUser, setNameUser] = useState("");
  const [emailUser, setEmailUser] = useState("");
  const [passwordUser, setpasswordUser] = useState("");

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.title = "Econtas - Register";
  }, []);

  const {
    userTokenSaved,
    setErrorMessage,
    errorMessage,
    setLoading,
  } = useContext(Context);

  const handlePersistUser = async () => {
    // name, email, senha

    const userData = {
      name: nameUser,
      email: emailUser,
      password: passwordUser,
      transactions: [],
    };

    if (validadeFormData(userData)) return;

    setLoading(true);

    try {
      const { data } = await api.post("/user/register", userData);

      console.log(data);

      const { user, token } = data;

      userTokenSaved(user, token);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorMessage(null);
      if (err.response) {
        const { data, status } = err.response;
        setErrorMessage({ message: data.message, code: status });
      } else {
        setErrorMessage(err.message);
      }
    }
  };

  const validadeFormData = (data) => {
    const { name, email, password } = data;

    if (name === "" || email === "" || password === "") {
      return true;
    }

    return false;
  };

  return (
    <div className={`${css.boxContainer} ${theme === "dark" && css.dark}`}>
      <div className={`${css.formContainer} ${theme === "dark" && css.dark}`}>
        <div className={css.headerLogin}>
          <img src={theme !== "dark" ? LogoLight : LogoDark} alt="Econtas" />
          <h2>Register</h2>
        </div>
        <form className="col-12">
          <div className="input-field col-12">
            <input
              type="text"
              id={"name-register"}
              className={"z-depth-5"}
              name="name-register"
              required
              value={nameUser}
              onChange={(event) => {
                setErrorMessage(null);
                return setNameUser(event.target.value);
              }}
            />
            <label htmlFor={"name-register"}>Nome</label>
          </div>
          <div className="input-field">
            <input
              type="email"
              id={"email-register"}
              className={"z-depth-5"}
              name="email-register"
              required
              value={emailUser}
              onChange={(event) => {
                setErrorMessage(null);
                return setEmailUser(event.target.value);
              }}
            />
            <label htmlFor={"email-register"}>E-mail</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              id="senha-register"
              className="z-depth-5"
              name="senha-register"
              required
              value={passwordUser}
              onChange={(event) => {
                setErrorMessage(null);
                return setpasswordUser(event.target.value);
              }}
            />
            <label htmlFor={"senha-register"}>Senha</label>
          </div>
        </form>
        <div className={css.buttonsRegister}>
          <button onClick={handlePersistUser} type="submit">
            Salvar
          </button>
          <span>
            <a onClick={() => window.history.back()}>Voltar</a>
          </span>
        </div>
      </div>
      {errorMessage && (
        <Message message={errorMessage.message} code={errorMessage.code} />
      )}
    </div>
  );
}
