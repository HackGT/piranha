import {gql} from "@apollo/client";
import {User} from "./User";

export type Project = {
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,
    year: number,
    archived: boolean,
    shortCode: string,
    leads: [User]
}

export const PROJECTS_QUERY = gql`
    query projects {
        projects {
            id
            name
            year
            leads {
                preferredName
                lastName
                id
            }
            archived
            shortCode
        }
    }`;