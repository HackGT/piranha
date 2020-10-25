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
  status: RequisitionStatus,
  pointOfContact: User,
  createdBy: User,
  project: Project,
  vendor: Vendor,
  projectRequisitionId: number,
  paymentRequiredBy: Date,
  requisitionitemSet: RequisitionItem[],
  approvalSet: Approval[],
  paymentSet: Payment[],
  fileSet: File[],
  referenceString: string,
  canEdit: boolean,
  canCancel: boolean,
  canExpense: boolean,
  otherFees: number,
  shippingLocation: string,
  orderDate: string, // Used for non-reimbursements
  purchaseDate: string, // Used for reimbursements
  isReimbursement: boolean
  fundingSource: PaymentMethod,
  budget: Budget
}

export type RequisitionItem = {
  name: string,
  unitPrice: number,
  quantity: number,
  link: string,
  notes: string,
  received: boolean,
  lineItem: LineItem,
  vendor: Vendor
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
  requisitionitemSet: RequisitionItem[];
  status: RequisitionStatus;
  fileSet: any[];
  purchaseDate: moment.Moment | null;
}

export const REQUISITION_FORM_QUERY = gql`
  query requisitionForm {
    projects(where: {archived: false}) {
      id
      name
      referenceString
    }
  
    vendors(where: {isActive: true}) {
      id
      name
    }
    
    budgets {
      id
      name
      group {
        id
        name
      }
      categorySet {
        id
        name
        lineitemSet {
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
      requisitionitemSet {
        id
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
      fullName
    }
    project {
      id
      name
      referenceString
      requisitionSet {
        projectRequisitionId
      }
    }
    vendor {
      id
      name
      isActive
    }
    projectRequisitionId
    paymentRequiredBy
    requisitionitemSet {
      id
      name
      quantity
      unitPrice
      link
      notes
      received
      vendor {
        id
        name
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
    approvalSet {
      id
      isApproving
      approver {
        id
        fullName
      }
      notes
      createdAt
    }
    paymentSet {
      id
      amount
      fundingSource {
        id
        name
      }
      date
    }
    fileSet {
      id
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
      group {
        id
        name
      }
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
      requisition {
        ...RequisitionInfoFragment
      }
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
`;

export const UPDATE_REQUISITION_MUTATION = gql`
  mutation updateRequisition($data: RequisitionInput!, $id: ID!) {
    updateRequisition(data: $data, id: $id) {
      requisition {
        ...RequisitionInfoFragment
      }
    }
  }
  ${REQUISITION_INFO_FRAGMENT}
`;
