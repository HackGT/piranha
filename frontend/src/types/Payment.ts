import { gql } from "@apollo/client";
import { PaymentMethod } from "./PaymentMethod";
import { Requisition, REQUISITION_INFO_FRAGMENT } from "./Requisition";

export type Payment = {
  amount: number;
  requisition: Requisition;
  fundingSource: PaymentMethod;
  date: Date;
}

export const PAYMENT_INFO_FRAGMENT = gql`
  fragment PaymentInfoFragment on Payment {
    id
    requisition {
      id
      status
      paymentSet {
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
      payment {
        ...PaymentInfoFragment
      }
    }
  }
  ${PAYMENT_INFO_FRAGMENT}
`;

export const UPDATE_REQUISITION_AND_CREATE_PAYMENT_MUTATION = gql`
  mutation updateRequisitionAndCreatePayment($requisitionData: RequisitionInput!, $id: ID!, $paymentData: PaymentInput!) {
    updateRequisition(data: $requisitionData, id: $id) {
      requisition {
        ...RequisitionInfoFragment
      }
    }
    
    createPayment(data: $paymentData) {
      payment {
        ...PaymentInfoFragment
      }
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
  ${PAYMENT_INFO_FRAGMENT}
`;
