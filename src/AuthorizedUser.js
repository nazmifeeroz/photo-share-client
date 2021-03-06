import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Mutation, Query } from "react-apollo";
import { gql } from "apollo-boost";
import { ROOT_QUERY } from "./App";

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

const Me = ({ logout, requestCode, signingIn }) => (
  <Query query={ROOT_QUERY}>
    {({ loading, data, refetch }) =>
      data.me ? (
        <CurrentUser {...data.me} logout={logout} refetch={refetch} />
      ) : loading ? (
        <p>loading...</p>
      ) : (
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with Github
        </button>
      )
    }
  </Query>
);

const CurrentUser = ({ name, avatar, logout, refetch }) => (
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button
      onClick={() => {
        logout();
        refetch();
      }}
    >
      logout
    </button>
  </div>
);

class AuthorizedUser extends Component {
  state = { signingIn: false };
  authorizationComplete = (cache, { data }) => {
    localStorage.setItem("token", data.githubAuth.token);
    this.props.history.replace("/");
    this.setState({ signingIn: false });
  };
  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true });
      const code = window.location.search.replace("?code=", "");

      this.githubAuthMutation({ variables: { code } });
    }
  }
  requestCode() {
    var clientID = "2a492151a488e8f69408";
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  }
  render() {
    return (
      <Mutation
        mutation={GITHUB_AUTH_MUTATION}
        update={this.authorizationComplete}
        refetchQueries={[{ query: ROOT_QUERY }]}
      >
        {mutation => {
          this.githubAuthMutation = mutation;
          console.log(localStorage.getItem("token"));
          return (
            <Me
              signingIn={this.state.signingIn}
              requestCode={this.requestCode}
              logout={() => localStorage.removeItem("token")}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(AuthorizedUser);
