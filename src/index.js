import React from "react";
import { render } from "react-dom";
import App from "./App";
import { ApolloProvider } from "react-apollo";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split
} from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem("token")
      }
    }));
  }
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
