import React from "react";
import Users from "./Users";
import { BrowserRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import AuthorizedUser from "./AuthorizedUser";
import { withApollo } from "react-apollo";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
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

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`;

// const App = () => (
//   <BrowserRouter>
//     <div>
//       <AuthorizedUser />
//       <Users />
//     </div>
//   </BrowserRouter>
// );

class App extends React.Component {
  componentDidMount() {
    let { client } = this.props;
    this.listenForUsers = client
      .subscribe({ query: LISTEN_FOR_USERS })
      .subscribe(({ data: { newUser } }) => {
        const data = client.readQuery({ query: ROOT_QUERY });
        data.totalUsers += 1;
        data.allUsers = [...data.allUsers, newUser];
        client.writeQuery({ query: ROOT_QUERY, data });
      });
  }
  componentWillUnmount() {
    this.listenForUsers.unsubscribe();
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <AuthorizedUser />
          <Users />
        </div>
      </BrowserRouter>
    );
  }
}

export default withApollo(App);
