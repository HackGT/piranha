import { gql } from "@apollo/client";

export const BUDGET_INFO_FRAGMENT = gql`
  fragment BudgetInfoFragment on Budget {
    id
    name
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

export const CREATE_BUDGET_MUTATION = gql`
  mutation createBudget($data: BudgetInput!) {
    createBudget(data: $data) {
      ...BudgetInfoFragment
    }
  }
  ${BUDGET_INFO_FRAGMENT}
`;

export const UPDATE_BUDGET_MUTATION = gql`
  mutation updateBudget($data: BudgetInput!, $id: ID!) {
    updateBudget(data: $data, id: $id) {
      ...BudgetInfoFragment
    }
  }
  ${BUDGET_INFO_FRAGMENT}
`;
