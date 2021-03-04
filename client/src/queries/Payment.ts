import { gql } from "@apollo/client";

import { REQUISITION_INFO_FRAGMENT } from "./Requisition";

export const PAYMENT_INFO_FRAGMENT = gql`
  fragment PaymentInfoFragment on Payment {
    id
    requisition {
      id
      status
      payments {
        id
        amount
        fundingSource {
          id
          name
        }
        date
      }
    }
  }
`;

export const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($data: PaymentInput!) {
    createPayment(data: $data) {
      ...PaymentInfoFragment
    }
  }
  ${PAYMENT_INFO_FRAGMENT}
`;

export const UPDATE_REQUISITION_AND_CREATE_PAYMENT_MUTATION = gql`
  mutation updateRequisitionAndCreatePayment(
    $requisitionData: RequisitionInput!
    $id: ID!
    $paymentData: PaymentInput!
  ) {
    updateRequisition(data: $requisitionData, id: $id) {
      ...RequisitionInfoFragment
    }

    createPayment(data: $paymentData) {
      ...PaymentInfoFragment
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
  ${PAYMENT_INFO_FRAGMENT}
`;
