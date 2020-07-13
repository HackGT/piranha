import { gql } from "@apollo/client";
import { User } from "./User";
import { Requisition } from "./Requisition";

export type Approval = {
  approver: User;
  requisition: Requisition;
  notes: string;
  isApproving: boolean;
}

export const CREATE_APPROVAL_MUTATION = gql`
  mutation createApproval($data: ApprovalInput!) {
    createApproval(data: $data) {
      approval {
        id
      }
    }
  }
`;
