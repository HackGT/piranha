import { gql } from "@apollo/client";

export type PaymentMethod = {
  id: number,
  name: string,
  reimbursementInstructions: string;
  isDirectPayment: boolean;
  isActive: boolean
}

export const PAYMENT_METHOD_EXPENSE_QUERY = gql`
  query paymentMethodExpense {
    paymentMethods(isActive: true) {
      id
      name
    }
  }
`;

export const PAYMENT_METHOD_INFO_FRAGMENT = gql`
  fragment PaymentMethodInfoFragment on PaymentMethod {
    id
    name
    reimbursementInstructions
    isDirectPayment
    isActive
  }
`;

export const PAYMENT_METHOD_LIST_QUERY = gql`
  query paymentMethodList {
    paymentMethods {
      ...PaymentMethodInfoFragment
    }
  }
  ${PAYMENT_METHOD_INFO_FRAGMENT}
`;

export const CREATE_PAYMENT_METHOD_MUTATION = gql`
  mutation createPaymentMethod($data: PaymentMethodInput!) {
    createPaymentMethod(data: $data) {
      ...PaymentMethodInfoFragment
    }
  }
  ${PAYMENT_METHOD_INFO_FRAGMENT}
`;

export const UPDATE_PAYMENT_METHOD_MUTATION = gql`
  mutation updatePaymentMethod($data: PaymentMethodInput!, $id: ID!) {
    updatePaymentMethod(data: $data, id: $id) {
      ...PaymentMethodInfoFragment
    }
  }
  ${PAYMENT_METHOD_INFO_FRAGMENT}
`;
