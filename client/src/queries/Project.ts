import { gql } from "@apollo/client";

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
        description
        status
        canEdit
        otherFees
        isReimbursement
        createdBy {
          id
          name
        }
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
