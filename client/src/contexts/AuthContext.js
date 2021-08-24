import React, { createContext, useEffect, useState } from "react";
import history from "../helpers/history";
import api from "../api/api";
import jwt from "jwt-decode";

const Context = createContext();

function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      const userId = jwt(token);
      setUser({ _id: userId.id });
      setAuthenticated(true);
      history.push("/Home");
    }

    setLoading(false);
    setErrorMessage(null);
  }, []);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/user/login", { email, password });

      const { user, token } = data;
      userTokenSaved(user, token);
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

  const handleLogout = () => {
    setLoading(true);
    setAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    api.defaults.headers.Authorization = undefined;
    setLoading(false);
    history.push("/");
  };

  const userTokenSaved = (user, token) => {
    localStorage.setItem("token", JSON.stringify(token));
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setAuthenticated(true);
    setUser(user);
    setLoading(false);
    history.push("/Home");
  };

  return (
    <Context.Provider
      value={{
        authenticated,
        user,
        handleLogin,
        handleLogout,
        userTokenSaved,
        loading,
        setLoading,
        errorMessage,
        setErrorMessage,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };
