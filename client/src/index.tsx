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

// To work with Django's CSRF protection, this function takes the unique CSRF token provided in a cookie by Django
// and sends it with every GraphQL request from Apollo as a header so that the requests pass Django's
// CSRF protection.  As recommended by https://docs.djangoproject.com/en/2.2/ref/csrf/#ajax

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // @ts-ignore
  link: createUploadLink({
    uri: "/graphql",
    credentials: "include",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
    }
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
