import gql from 'graphql-tag';

export const USERNAME_CHECK = gql`
mutation checkUsername($username: String!) {
  checkUsername(username: $username) {
    username
    available
  }
}
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
    }
  }
`;

export const LOGIN = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      id
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`;
