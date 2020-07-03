import { gql } from "@apollo/client";
import moment from "moment";
import { User } from "./User";
import { Project } from "./Project";
import { Vendor } from "./Vendor";

export type RequisitionStatus =
  "DRAFT" |
  "SUBMITTED" |
  "PENDING_CHANGES" |
  "READY_TO_ORDER" |
  "ORDERED" |
  "RECEIVED" |
  "CANCELLED";

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
  referenceString: string,
  canEdit: boolean,
  otherFees: number
}

export type RequisitionItem = {
  name: string,
  unitPrice: number,
  quantity: number,
  link: string,
  notes: string
}

export type RequisitionFormData = {
  headline: string;
  project: string;
  description: string;
  vendor: string;
  paymentRequiredBy: moment.Moment | undefined;
  otherFees: string;
  items: {
    name: string;
    link: string;
    quantity: number;
    unitPrice: string;
    notes: string;
  }[]
  status: RequisitionStatus;
}

export const CREATE_REQUISITION_MUTATION = gql`
  mutation createRequisition($data: RequisitionInput!) {
    createRequisition(data: $data) {
      requisition {
        id
        project {
          referenceString
        }
        projectRequisitionId
      }
    }
  }
`;

export const UPDATE_REQUISITION_MUTATION = gql`
  mutation updateRequisition($data: RequisitionInput!, $id: ID!) {
    updateRequisition(data: $data, id: $id) {
      requisition {
        id
        project {
          referenceString
        }
        projectRequisitionId
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
        referenceString
      }
      requisitionitemSet {
        id
        quantity
        unitPrice
      }
      otherFees
    }
  }`;

export const REQUISITION_DETAIL_QUERY = gql`
  query requisition($year: Int!, $shortCode: String!, $projectRequisitionId: Int!) {
    requisition(year: $year, shortCode: $shortCode, projectRequisitionId: $projectRequisitionId) {
      id
      headline
      description
      status
      createdBy {
        preferredName
        lastName
      }
      project {
        id
        name
        requisitionSet {
          projectRequisitionId
        }
      }
      vendor {
        id
        name
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
      }
      canEdit
      referenceString
      otherFees
    }
  }`;
