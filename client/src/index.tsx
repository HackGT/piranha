import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";
import { createUploadLink } from "apollo-upload-client";
import * as Sentry from "@sentry/react";
import App from "./App";

if (process.env.NODE_ENV === "production") {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN });
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // @ts-ignore
  link: createUploadLink({
    uri: "/graphql",
    credentials: "include"
  })
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
