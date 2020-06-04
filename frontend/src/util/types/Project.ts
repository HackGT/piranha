import {gql} from "@apollo/client";
import {User} from "./User";
import {Requisition} from "./Requisition";

export type Project = {
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,
    year: number,
    archived: boolean,
    shortCode: string,
    leads: [User],
    requisitionSet: Requisition[],
    referenceString: string
}

export const PROJECTS_QUERY = gql`
    query projects {
        projects(where: {archived: false}) {
            id
            name
            referenceString
            leads {
                preferredName
                lastName
                id
            }
        }
    }`;

export const PROJECT_DETAIL_QUERY = gql`
    query project($year: Int!, $shortCode: String!) {
        project(year: $year, shortCode: $shortCode) {
            id
            name
            archived
            referenceString
            year
            requisitionSet {
                id
                referenceString
                projectRequisitionId
                headline
                status
                project {
                    referenceString
                }
            }
            leads {
                preferredName
                lastName
                id
            }
        }
    }`;