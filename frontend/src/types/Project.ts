import { gql } from "@apollo/client";
import { User } from "./User";
import { Requisition } from "./Requisition";

export type Project = {
  id: number,
  updatedAt: string,
  name: string,
  year: number,
  archived: boolean,
  shortCode: string,
  leads: [User],
  requisitions: Requisition[],
  referenceString: string
}

export const PROJECT_INFO_FRAGMENT = gql`
  fragment ProjectInfoFragment on Project {
    id
    name
    archived
    referenceString
    year
    shortCode
    leads {
      id
      name
    }
  }
`;

export const PROJECT_DETAIL_QUERY = gql`
  query project($year: Int!, $shortCode: String!) {
    project(year: $year, shortCode: $shortCode) {
      requisitions {
        id
        referenceString
        projectRequisitionId
        headline
        status
        canEdit
        otherFees
        isReimbursement
        project {
          referenceString
        }
        items {
          name
          quantity
          unitPrice
          link
        }
      }
      ...ProjectInfoFragment
    }
  }
  ${PROJECT_INFO_FRAGMENT}
`;

export const PROJECT_LIST_QUERY = gql`
  query projectList {
    projects {
      requisitions {
        id
      }
      ...ProjectInfoFragment
    }
  }
  ${PROJECT_INFO_FRAGMENT}
`;

export const CREATE_PROJECT_MUTATION = gql`
  mutation createProject($data: ProjectInput!) {
    createProject(data: $data) {
      ...ProjectInfoFragment
    }
  }
  ${PROJECT_INFO_FRAGMENT}
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation updateProject($data: ProjectInput!, $id: ID!) {
    updateProject(data: $data, id: $id) {
      ...ProjectInfoFragment
    }
  }
  ${PROJECT_INFO_FRAGMENT}
`;
