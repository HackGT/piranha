import { gql } from "@apollo/client";

export const ALL_USERS_QUERY = gql`
  query allUsers {
    users {
      id
      name
      email
    }
  }
`;

export const USER_INFO_QUERY = gql`
  query user {
    user {
      id
      uuid
      name
      email
      hasAdminAccess
    }
  }
`;

export const USER_INFO_FRAGMENT = gql`
  fragment UserInfoFragment on User {
    id
    uuid
    name
    email
    hasAdminAccess
    accessLevel
    slackId
  }
`;

export const USER_LIST_QUERY = gql`
  query userList {
    users {
      ...UserInfoFragment
    }
  }
  ${USER_INFO_FRAGMENT}
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($data: UserInput!, $id: ID!) {
    updateUser(data: $data, id: $id) {
      ...UserInfoFragment
    }
  }
  ${USER_INFO_FRAGMENT}
`;
