import { gql } from "@apollo/client";

export enum UserAccessLevel {
  NONE = "NONE",
  MEMBER = "MEMBER",
  EXEC = "EXEC",
  ADMIN = "ADMIN"
}

export type User = {
  id: string,
  groundTruthId: string,
  firstName: string,
  preferredName: string,
  lastName: string,
  fullName: string,
  email: string,
  hasAdminAccess: boolean,
  isActive: boolean,
  accessLevel: UserAccessLevel,
  slackId: string
}

export const ALL_USERS_QUERY = gql`
  query allUsers {
    users(where: {isActive: true}) {
      id
      fullName
      email
    }
  }
`;

export const USER_INFO_QUERY = gql`
  query user {
    user {
      id
      groundTruthId
      fullName
      email
      hasAdminAccess
    }
  }
`;

export const USER_INFO_FRAGMENT = gql`
  fragment UserInfoFragment on User {
    id
    groundTruthId
    fullName
    firstName
    preferredName
    lastName
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
  mutation updateUser($data: UserInput!, $id: UUID!) {
    updateUser(data: $data, id: $id) {
      user {
        ...UserInfoFragment
      }
    }
  }
  ${USER_INFO_FRAGMENT}
`;
