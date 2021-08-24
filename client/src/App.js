import React, { useState, useEffect } from "react";

import { Router, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import history from "./helpers/history";

import Routes from "./routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router history={history}>
          {/*  <Header islogin={false} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/Charts" component={Charts} />
          <Route path="/Register" component={Register} /> */}
          {/*  <Route path="/Login" component={LoginPage} /> */}
          {/*   <Route path="/Login" component={Login} />
        </Switch> */}
          <Routes />
          {/* <Route component={ResetPassword} path="/reset_password" /> */}
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
