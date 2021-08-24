import React, { useContext, useState } from "react";
import Message from "../components/Message";
import api from "../api/api";

import { Context } from "../contexts/AuthContext";
import css from "../styles/pages/FormUser.module.css";
import Spinner from "../components/Spinner";
import history from "../helpers/history";

import LogoLight from "../assets/image/logo-light.png";
import LogoDark from "../assets/image/logo-dark.png";
import { ThemeContext } from "../contexts/ThemeContext";

export default function ResetPassword(props) {
  const { setErrorMessage, errorMessage } = useContext(Context);
  const { theme } = useContext(ThemeContext);

  const [email_, setemail_] = useState("");
  const [pass_One, setPass_One] = useState("");
  const [pass_Two, setPass_Two] = useState("");
  const [spinner, setSpinner] = useState(false);

  const handleEmailText = (event) => {
    setErrorMessage(null);
    setemail_(event.target.value);
  };
  const handlePasswordTextOne = (event) => {
    setErrorMessage(null);
    setPass_One(event.target.value);
  };
  const handlePasswordTextTwo = (event) => {
    setErrorMessage(null);
    setPass_Two(event.target.value);
  };
  const handleResetPassword = async () => {
    setErrorMessage(null);
    if (email_ === "" || pass_One === "" || pass_Two === "") {
      setErrorMessage({
        message: "Favor preencher campos obrigatorios",
        code: 400,
      });
      return;
    }

    if (pass_One !== pass_Two) {
      setErrorMessage({
        message: "As senhas não batem, favor digitar novamente",
        code: 400,
      });
      setPass_One("");
      setPass_Two("");
      return;
    }
    setSpinner(true);
    setErrorMessage(null);

    try {
      const query = props.location.search;

      const data = await api.post(`/user/reset_password${query}`, {
        email: email_,
        password: pass_One,
      });

      const { data: value, status } = data;

      setemail_("");
      setPass_One("");
      setPass_Two("");
      setSpinner(false);
      history.push("/");
      setErrorMessage({ message: value.message, code: status });
      return;
    } catch (err) {
      setErrorMessage(null);
      setSpinner(false);
      if (err.response) {
        const { data, status } = err.response;
        setErrorMessage({ message: data.message, code: status });
        return;
      } else {
        setErrorMessage(err.message);
        return;
      }
    }
  };

  return (
    <div className={css.boxContainer}>
      <div className={css.formContainer}>
        <div className={css.headerLogin}>
          <img src={theme !== "dark" ? LogoLight : LogoDark} alt="Econtas" />

          <h2>Redefinir sua senha</h2>
        </div>
        <form>
          <div className="input-field">
            <input
              type="email"
              id={"email"}
              className="z-depth-5 validate"
              name="email"
              required
              value={email_}
              onChange={handleEmailText}
            />
            <label htmlFor={"email"}>E-mail</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              id="senha1"
              className="z-depth-5 validate"
              name="senha1"
              required
              value={pass_One}
              onChange={handlePasswordTextOne}
            />
            <label htmlFor={"senha"}>Senha</label>
          </div>
          <div className="input-field">
            <input
              type="password"
              id="senha2"
              className="z-depth-5 validate"
              name="senha2"
              required
              value={pass_Two}
              onChange={handlePasswordTextTwo}
            />
            <label htmlFor={"senha"}>Confirme sua senha</label>
          </div>
        </form>
        {spinner ? (
          <Spinner />
        ) : (
          <button onClick={handleResetPassword} type="submit">
            Redefinir
          </button>
        )}
      </div>

      {errorMessage && (
        <Message message={errorMessage.message} code={errorMessage.code} />
      )}
    </div>
  );
}
