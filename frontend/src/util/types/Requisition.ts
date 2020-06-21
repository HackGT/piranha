import {User} from "./User";
import {Project} from "./Project";
import {Vendor} from "./Vendor";
import {gql} from "@apollo/client";
import {PresetColorType} from "antd/es/_util/colors";

export type RequisitionStatus =
    "DRAFT" |
    "SUBMITTED" |
    "PENDING_CHANGES" |
    "READY_TO_ORDER" |
    "ORDERED" |
    "RECEIVED" |
    "CANCELLED";

export const StatusToColor = (status: RequisitionStatus): PresetColorType => {
    switch (status) {
        case "DRAFT": return "magenta"
        case "SUBMITTED": return "gold"
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

export const StatusToStep = (status: RequisitionStatus): number => {
    switch (status) {
        case "DRAFT": return 0
        case "SUBMITTED": return 1
        case "PENDING_CHANGES": return 1
        case "READY_TO_ORDER": return 2
        case "ORDERED": return 3
        case "RECEIVED": return 4
        case "CANCELLED": return 1
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
    requisitionitemSet: RequisitionItem[],
    referenceString: string,
    canEdit: boolean,
    otherFees: number
}

// Sums up total costs for requisition items
export const getTotalItemsCost = (requisition: Requisition): string => {
    let total = 0;
    for (const requisitionItem of requisition.requisitionitemSet) {
        total += requisitionItem.quantity * requisitionItem.unitPrice
    }

    return '$' + total.toFixed(2);
}

// Sums up total costs for requisition items plus other fees
export const getTotalCost = (requisition: Requisition): string => {
    let total = 0;
    for (const requisitionItem of requisition.requisitionitemSet) {
        total += requisitionItem.quantity * requisitionItem.unitPrice
    }

    total += requisition.otherFees;

    return '$' + total.toFixed(2)
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