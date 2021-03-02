import { gql } from "@apollo/client";
import { REQUISITION_INFO_FRAGMENT } from "./Requisition";

export const UPDATE_REQUISITION_AND_CREATE_APPROVAL_MUTATION = gql`
  mutation updateRequisitionAndCreateApproval($requisitionData: RequisitionInput!, $id: ID!, $approvalData: ApprovalInput!) {
    updateRequisition(data: $requisitionData, id: $id) {
      ...RequisitionInfoFragment
    }
    
    createApproval(data: $approvalData) {
      id
      requisition {
        id
        status
        approvals {
          id
          isApproving
          approver {
            id
            name
          }
          notes
          date
        }
      }
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
`;
