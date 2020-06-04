import {User} from "./User";
import {Project} from "./Project";
import {Vendor} from "./Vendor";
import {gql} from "@apollo/client";
import {SemanticCOLORS} from "semantic-ui-react/dist/commonjs/generic";

export type RequisitionStatus =
    "DRAFT" |
    "SUBMITTED" |
    "PENDING_CHANGES" |
    "READY_TO_ORDER" |
    "ORDERED" |
    "RECEIVED" |
    "CANCELLED";

export const StatusToColor = (status: RequisitionStatus): SemanticCOLORS => {
    switch (status) {
        case "DRAFT": return "grey"
        case "SUBMITTED": return "yellow"
        case "PENDING_CHANGES": return "orange"
        case "READY_TO_ORDER": return "green"
        case "ORDERED": return "blue"
        case "RECEIVED": return "blue"
        case "CANCELLED": return "red"
    }
}

export const StatusToString = (status: RequisitionStatus): string => {
    switch (status) {
        case "DRAFT": return "Draft"
        case "SUBMITTED": return "Submitted"
        case "PENDING_CHANGES": return "Pending Changes"
        case "READY_TO_ORDER": return "Ready to Order"
        case "ORDERED": return "Ordered"
        case "RECEIVED": return "Received"
        case "CANCELLED": return "Cancelled"
    }
}

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
    items: RequisitionItem[],
    referenceString: string
}

export type RequisitionItem = {
    name: string,
    price: number,
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
        }
    }`;