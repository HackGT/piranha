import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import {ApolloClient, ApolloLink, ApolloProvider, concat, HttpLink, InMemoryCache} from "@apollo/client";
import Cookies from "js-cookie";

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
            <App/>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
