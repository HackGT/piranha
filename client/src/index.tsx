import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import * as Sentry from "@sentry/react";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";

if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
