import React, { useContext, useEffect, useState } from "react";

import css from "../styles/pages/FormUser.module.css";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import { Context } from "../contexts/AuthContext";
import api from "../api/api";
import LogoLight from "../assets/image/logo-light.png";
import LogoDark from "../assets/image/logo-dark.png";

import Spinner from "../components/Spinner";
import { ThemeContext } from "../contexts/ThemeContext";

export default function Login() {
  const { handleLogin, errorMessage, setErrorMessage } = useContext(Context);
  const { theme } = useContext(ThemeContext);

  const [email_, setEmail_] = useState("");
  const [pass_, setPass_] = useState("");
  const [forgotPassword, setforgotPassword] = useState(false);
  const [emailForgotPassword, setemailForgotPassword] = useState("");
  const [spinner, setSpinner] = useState(false);

  useEffect(() => {
    document.addEventListener("keypress", handleAuthenticate);
    return () => {
      document.removeEventListener("keypress", handleAuthenticate);
    };
  });

  const handleAuthenticate = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (email_ === "" || pass_ === "") return;

      const data = {
        email: email_,
        password: pass_,
      };

      handleLogin(data);
      setEmail_("");
      setPass_("");
    }
  };
  const handleEmailText = (event) => {
    setEmail_(event.target.value);
    setErrorMessage(null);
  };
  const handlePasswordText = (event) => {
    setPass_(event.target.value);
    setErrorMessage(null);
  };
  const handleForgotPassaword = async () => {
    setErrorMessage(null);

    if (emailForgotPassword === "") {
      setErrorMessage({
        message: "Favor colocar o Email!",
        code: 400,
      });
      return;
    }
    setSpinner(true);
    try {
      const data = await api.post("/user/forgot_password", {
        email: emailForgotPassword,
      });

      const { data: value, status } = data;
      setSpinner(false);
      setemailForgotPassword("");
      setforgotPassword(false);
      setErrorMessage({ message: value.message, code: status });
      return;
    } catch (err) {
      setErrorMessage(null);
      setSpinner(false);
      if (err.response) {
        const { data, status } = err.response;
        setErrorMessage({ message: data.message, code: status });
      } else {
        setErrorMessage({ message: err.message });
      }
      setemailForgotPassword("");
      return;
    }
  };

  return (
    <div className={`${css.boxContainer} ${theme === "dark" && css.dark}`}>
      <div className={`${css.formContainer} ${theme === "dark" && css.dark}`}>
        {forgotPassword ? (
          <div
            className={`row center ${css.boxforgotPassword} ${
              theme === "dark" && css.dark
            }`}
          >
            <i className="material-icons center" style={{ fontSize: "90px" }}>
              lock_clock
            </i>

            <p>Esqueceu sua senha?</p>
            <span>Favor colocar seu email abaixo!</span>
            <div className="input-field">
              <i className="material-icons prefix">email</i>
              <input
                id="icon_prefix"
                type="text"
                className="validate"
                value={emailForgotPassword}
                onChange={(event) => {
                  setErrorMessage(null);
                  setemailForgotPassword(event.target.value);
                }}
              />
              <label htmlFor="icon_prefix">Email</label>
            </div>
            <span
              style={{
                color: theme === "dark" ? "yellow" : "red",
                fontWeight: "400",
              }}
            >
              Enviaremos um email com informações para troca da senha.
            </span>
            {spinner ? (
              <Spinner />
            ) : (
              <>
                <button onClick={handleForgotPassaword}>Enviar</button>
                <span>
                  <a
                    onClick={() => {
                      setErrorMessage(null);
                      setforgotPassword(false);
                      document.title = "Econtas - Login";
                    }}
                  >
                    Voltar
                  </a>
                </span>
              </>
            )}
          </div>
        ) : (
          <>
            <div className={css.headerLogin}>
              <img
                src={theme !== "dark" ? LogoLight : LogoDark}
                alt="Econtas"
              />
              <h2>Login</h2>
            </div>
            <form>
              <div className="input-field">
                <input
                  type="email"
                  id={"email"}
                  className="z-depth-5"
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
                  id="senha"
                  className="z-depth-5"
                  name="senha"
                  required
                  value={pass_}
                  onChange={handlePasswordText}
                />
                <label htmlFor={"senha"}>Senha</label>
              </div>
            </form>
            <a
              onClick={() => {
                setErrorMessage(null);
                setforgotPassword(true);
                document.title = "Econtas - Esqueceu sua senha? ";
              }}
            >
              Esqueceu sua senha?
            </a>
            <button onClick={handleAuthenticate} type="submit">
              Entrar
            </button>

            <span>
              Não tem conta?
              <Link to="/Register">Cadastre-se</Link>
            </span>
          </>
        )}
      </div>

      {errorMessage && (
        <Message message={errorMessage.message} code={errorMessage.code} />
      )}
    </div>
  );
}
