import {gql} from "@apollo/client";

type FiscalYear = {
    id: number,
    startDate: string,
    endDate: string,
    friendlyName: string,
    archived: boolean
}

export const FISCAL_YEARS_QUERY = gql`
    query AllFiscalYears {
        fiscalYears {
            id
            startDate
            endDate
            friendlyName
            archived
        }
    }`;