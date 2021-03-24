import { gql } from "@apollo/client";

export const CATEGORY_INFO_FRAGMENT = gql`
  fragment CategoryInfoFragment on Category {
    id
    name
    lineItems {
      id
      name
      quantity
      unitCost
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = gql`
  mutation createCategory($data: CategoryInput!) {
    createCategory(data: $data) {
      ...CategoryInfoFragment
    }
  }
  ${CATEGORY_INFO_FRAGMENT}
`;

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation updateCategory($data: CategoryInput!, $id: ID!) {
    updateCategory(data: $data, id: $id) {
      ...CategoryInfoFragment
    }
  }
  ${CATEGORY_INFO_FRAGMENT}
`;
