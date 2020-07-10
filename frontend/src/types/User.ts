import { gql } from "@apollo/client";

export type User = {
  id: string,
  preferredName: string,
  lastName: string,
  email: string,
  hasAdminAccess: boolean
}

export const ALL_USERS_QUERY = gql`
  query allUsers {
    users(where: {isActive: true}) {
      id
      preferredName
      lastName
    }
  }
`;

export const USER_INFO_QUERY = gql`
  query user {
    user {
      id
      preferredName
      lastName
      email
      hasAdminAccess
    }
  }
`;
