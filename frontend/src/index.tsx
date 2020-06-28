import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { ApolloClient, ApolloLink, ApolloProvider, concat, HttpLink, InMemoryCache } from "@apollo/client";
import Cookies from "js-cookie";
import App from "./App";

// To work with Django's CSRF protection, this middleware takes the unique CSRF token provided in a cookie by Django
// and sends it with every GraphQL request from Apollo as a header so that the requests pass Django's
// CSRF protection.  As recommended by https://docs.djangoproject.com/en/2.2/ref/csrf/#ajax
const csrfMiddleware = new ApolloLink(((operation, forward) => {
  operation.setContext({
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken")
    }
  });
  return forward(operation);
}));

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(csrfMiddleware, new HttpLink({
    uri: "/api/graphql",
    credentials: "include"
  }))
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
