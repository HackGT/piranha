import {User} from "./User";
import {Project} from "./Project";
import {Vendor} from "./Vendor";
import {gql} from "@apollo/client";

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

export const OPEN_REQUISITIONS_QUERY = gql`
    query requisitions {
        requisitions {
            id
            projectRequisitionId
            referenceString
            headline
            status
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
    }`