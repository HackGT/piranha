import { gql } from "@apollo/client";

export type User = {
  preferredName: string,
  lastName: string,
  id: string
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
