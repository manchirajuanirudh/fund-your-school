import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.jsx";
import RTLLayout from "layouts/RTL/RTL.jsx";
import Login from "layouts/Login/Login.jsx";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "assets/css/fys.css";

const hist = createBrowserHistory();

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/main" render={props => <AdminLayout {...props} />} />
      <Route path="/rtl" render={props => <RTLLayout {...props} />} />
      <Route path="/login" render={props => <Login />} />
      <Redirect from="*" to="/login/signIn" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
