import { gql } from "@apollo/client";
import { User } from "./User";
import { Requisition } from "./Requisition";

export type Approval = {
  approver: User;
  requisition: Requisition;
  notes: string;
  isApproving: boolean;
  createdAt: string;
}

export const CREATE_APPROVAL_MUTATION = gql`
  mutation createApproval($data: ApprovalInput!) {
    createApproval(data: $data) {
      approval {
        id
        requisition {
          id
          status
          approvalSet {
            id
            isApproving
            approver {
              id
              preferredName
              lastName
            }
            notes
            createdAt
          }
        }
      }
    }
  }
`;
