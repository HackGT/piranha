import { gql } from "@apollo/client";

export const REQUISITION_FORM_QUERY = gql`
  query requisitionForm {
    projects(archived: false) {
      id
      name
      referenceString
    }
  
    vendors(isActive: true) {
      id
      name
    }
    
    budgets {
      id
      name
      categories {
        id
        name
        lineItems {
          id
          name
        }
      }
    }
  }
`;

export const OPEN_REQUISITIONS_QUERY = gql`
  query requisitions {
    requisitions {
      id
      projectRequisitionId
      referenceString
      headline
      status
      description
      project {
        id
        referenceString
      }
      items {
        quantity
        unitPrice
      }
      otherFees
      isReimbursement
    }
  }
`;

export const REQUISITION_INFO_FRAGMENT = gql`
  fragment RequisitionInfoFragment on Requisition {
    id
    headline
    description
    status
    createdBy {
      id
      name
    }
    project {
      id
      name
      referenceString
      requisitions {
        id
      }
    }
    projectRequisitionId
    paymentRequiredBy
    items {
      name
      quantity
      unitPrice
      link
      notes
      received
      vendor {
        id
        name
        isActive
      }
      lineItem {
        id
        name
        category {
          id
          name
        }
      }
    }
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
    payments {
      id
      amount
      fundingSource {
        id
        name
      }
      date
    }
    files {
      id
      isActive
      name
      mimetype
      signedUrl
    }
    canEdit
    canCancel
    canExpense
    referenceString
    otherFees
    shippingLocation
    orderDate
    isReimbursement
    purchaseDate
    fundingSource {
      id
      name    
      reimbursementInstructions
      isDirectPayment
    }
    budget {
      id
      name
    }
  }
`;

export const REQUISITION_DETAIL_QUERY = gql`
  query requisition($year: Int!, $shortCode: String!, $projectRequisitionId: Int!) {
    requisition(year: $year, shortCode: $shortCode, projectRequisitionId: $projectRequisitionId) {
      ...RequisitionInfoFragment
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
`;

export const CREATE_REQUISITION_MUTATION = gql`
  mutation createRequisition($data: RequisitionInput!) {
    createRequisition(data: $data) {
      ...RequisitionInfoFragment
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
`;

export const UPDATE_REQUISITION_MUTATION = gql`
  mutation updateRequisition($data: RequisitionInput!, $id: ID!) {
    updateRequisition(data: $data, id: $id) {
      ...RequisitionInfoFragment
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
`;
