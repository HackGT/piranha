import { gql } from "@apollo/client";
import { PaymentMethod } from "./PaymentMethod";
import { Vendor } from "./Vendor";
import { Requisition } from "./Requisition";

export type Payment = {
  amount: number;
  recipient: Vendor;
  requisition: Requisition;
  fundingSource: PaymentMethod;
  date: Date;
  shippingLocation: string;
}

export const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($data: PaymentInput!) {
    createPayment(data: $data) {
      payment {
        id
        requisition {
          id
          status
          payment {
            id
            amount
            fundingSource {
              id
              name
            }
            date
            shippingLocation
          }
        }
      }
    }
  }
`;
