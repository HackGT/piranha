import { gql } from "@apollo/client";

export const BUDGET_INFO_FRAGMENT = gql`
  fragment BudgetInfoFragment on Budget {
    id
    name
    archived
    categories {
      id
      name
      lineItems {
        id
        name
        quantity
        unitCost
      }
    }
    requisitions {
      id
      otherFees
      items {
        id
        name
        quantity
        unitPrice
      }
    }
  }
`;

export const BUDGET_INFO_FRAGMENT_MUTATION = gql`
  fragment BudgetInfoFragmentMutation on Budget {
    id
    name
    archived
  }
`;

export const BUDGET_QUERY = gql`
  query budgets {
    budgets {
      ...BudgetInfoFragment
    }
  }
  ${BUDGET_INFO_FRAGMENT}
`;
// fix these to not return cateogries since we have it as null, add archived stuff
export const BUDGET_DETAIL_QUERY = gql`
  query budgets($id: ID!) {
    budget(id: $id) {
      ...BudgetInfoFragment
    }
  }
  ${BUDGET_INFO_FRAGMENT}
`;

export const CREATE_BUDGET_MUTATION = gql`
  mutation createBudget($data: BudgetInput!) {
    createBudget(data: $data) {
      ...BudgetInfoFragmentMutation
    }
  }
  ${BUDGET_INFO_FRAGMENT_MUTATION}
`;

export const UPDATE_BUDGET_MUTATION = gql`
  mutation updateBudget($data: BudgetInput!, $id: ID!) {
    updateBudget(data: $data, id: $id) {
      ...BudgetInfoFragmentMutation
    }
  }
  ${BUDGET_INFO_FRAGMENT_MUTATION}
`;
