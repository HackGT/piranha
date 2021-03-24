import { gql } from "@apollo/client";

export const LINE_ITEM_INFO_FRAGMENT = gql`
  fragment LineItemInfoFragment on LineItem {
    id
    name
    quantity
    unitCost
  }
`;

export const CREATE_LINE_ITEM_MUTATION = gql`
  mutation createLineItem($data: LineItemInput!) {
    createLineItem(data: $data) {
      ...LineItemInfoFragment
    }
  }
  ${LINE_ITEM_INFO_FRAGMENT}
`;

export const UPDATE_LINE_ITEM_MUTATION = gql`
  mutation updateLineItem($data: LineItemInput!, $id: ID!) {
    updateLineItem(data: $data, id: $id) {
      ...LineItemInfoFragment
    }
  }
  ${LINE_ITEM_INFO_FRAGMENT}
`;
