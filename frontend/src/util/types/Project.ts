import {FiscalYear} from "./FiscalYear";
import {gql} from "@apollo/client";
import {User} from "./User";

export type Project = {
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,
    fiscalYear: FiscalYear,
    archived: boolean,
    shortCode: string,
    leads: [User]
}

export const PROJECTS_QUERY = gql`
    query projects {
        projects {
            id
            name
            fiscalYear {
                id
                friendlyName
                startDate
                endDate
                archived
            }
            leads {
                preferredName
                lastName
                id
            }
            archived
            shortCode
        }
    }`;