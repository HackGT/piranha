import { gql } from "@apollo/client";
import moment from "moment";
import { User } from "./User";
import { Project } from "./Project";
import { Vendor } from "./Vendor";
import { Approval } from "./Approval";
import { Payment } from "./Payment";
import { File } from "./File";
import { PaymentMethod } from "./PaymentMethod";
import { Budget, LineItem } from "./Budget";

export type RequisitionStatus =
  "DRAFT" |
  "SUBMITTED" |
  "PENDING_CHANGES" |
  "READY_TO_ORDER" |
  "ORDERED" |
  "PARTIALLY_RECEIVED" |
  "RECEIVED" |
  "CLOSED" |
  "CANCELLED" |
  "READY_FOR_REIMBURSEMENT" |
  "AWAITING_INFORMATION" |
  "REIMBURSEMENT_IN_PROGRESS";

export type Requisition = {
  id: number,
  headline: string,
  description: string,
  items: RequisitionItem[],
  status: RequisitionStatus,
  createdBy: User,
  project: Project,
  vendor: Vendor,
  projectRequisitionId: number,
  paymentRequiredBy: Date,
  otherFees: number,
  isReimbursement: boolean
  budget: Budget
  approvals: Approval[],
  payments: Payment[],
  files: File[],
  shippingLocation: string, // Used for non-reimbursements
  orderDate: string, // Used for non-reimbursements
  fundingSource: PaymentMethod, // Used for reimbursements
  purchaseDate: string, // Used for reimbursements

  referenceString: string,
  canEdit: boolean,
  canCancel: boolean,
  canExpense: boolean
}

export type RequisitionItem = {
  name: string | null,
  unitPrice: number | null,
  quantity: number | null,
  link: string | null,
  notes: string | null,
  received: boolean | null,
  lineItem: LineItem | null
}

export type RequisitionFormData = {
  headline: string;
  project: string;
  description: string;
  vendor: string | undefined;
  budget: string | undefined;
  paymentRequiredBy: moment.Moment | null;
  otherFees: string;
  isReimbursement: boolean;
  items: RequisitionItem[];
  status: RequisitionStatus;
  files: any[];
  purchaseDate: moment.Moment | null;
}

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
    vendor {
      id
      name
      isActive
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
      isApproving
      approver {
        id
        name
      }
      notes
      date
    }
    payments {
      amount
      fundingSource {
        id
        name
      }
      date
    }
    files {
      name
      googleName
      type
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
