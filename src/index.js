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

const httpLink = new HttpLink({ uri: "http://localhost:4000/graphql" });
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: { reconnect: true }
});
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    headers: {
      ...context.headers,
      authorization: localStorage.getItem("token")
    }
  }));
  return forward(operation);
});
const httpAuthLink = authLink.concat(httpLink);
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpAuthLink
);

const cache = new InMemoryCache();

const client = new ApolloClient({ cache, link });
// const client = new ApolloClient({
//   uri: "http://localhost:4000/graphql",
//   request: operation => {
//     operation.setContext(context => ({
//       headers: {
//         ...context.headers,
//         authorization: localStorage.getItem("token")
//       }
//     }));
//   }
// });

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
