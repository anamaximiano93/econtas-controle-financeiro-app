import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { Context } from "./contexts/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Charts from "./pages/Charts";
import Layout from "./components/Layout";
import Loading from "./components/Loading";
import ResetPassword from "./pages/ResetPassword";
import Perfil from "./pages/Perfil";

function PrivateRoute({ isPrivate, ...rest }) {
  const { loading, authenticated } = useContext(Context);

  if (loading) {
    return <Loading />;
  }

  if (isPrivate && !authenticated) {
    return <Redirect to="/" />;
  }

  return <Route {...rest} />;
}

export default function Routes() {
  return (
    <Switch>
      <PrivateRoute exact path="/" component={Login} />
      <PrivateRoute exact path="/Register" component={Register} />
      <PrivateRoute exact path="/reset_password" component={ResetPassword} />

      <Layout>
        <PrivateRoute isPrivate exact path="/Home" component={Home} />
        <PrivateRoute isPrivate exact path="/Charts" component={Charts} />
        <PrivateRoute isPrivate exact path="/Perfil" component={Perfil} />
      </Layout>
    </Switch>
  );
}
