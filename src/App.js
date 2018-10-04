import React from "react";
import Users from "./Users";
import { gql } from "apollo-boost";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

export const ADD_FAKE_USERS_MUTATION = gql`
  mutation addGakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

const App = () => <Users />;

export default App;
