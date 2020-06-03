import {User} from "./User";
import {Project} from "./Project";
import {Vendor} from "./Vendor";
import {gql} from "@apollo/client";
import {SemanticCOLORS} from "semantic-ui-react/dist/commonjs/generic";

export enum RequisitionStatus {
    DRAFT = "Draft",
    SUBMITTED = "Submitted",
    PENDING_CHANGES = "Pending Changes",
    READY_TO_ORDER = "Ready to Order",
    ORDERED = "Ordered",
    RECEIVED = "Received",
    CANCELLED = "Cancelled"
}

export const StatusToColor = (status: RequisitionStatus): SemanticCOLORS => {
    switch (status) {
        case RequisitionStatus.DRAFT: return "grey"
        case RequisitionStatus.SUBMITTED: return "yellow"
        case RequisitionStatus.PENDING_CHANGES: return "orange"
        case RequisitionStatus.READY_TO_ORDER: return "green"
        case RequisitionStatus.ORDERED: return "blue"
        case RequisitionStatus.RECEIVED: return "blue"
        case RequisitionStatus.CANCELLED: return "red"
    }
}

export type Requisition = {
    headline: string,
    description: string,
    status: RequisitionStatus,
    pointOfContact: User,
    createdBy: User,
    project: Project,
    vendor: Vendor,
    projectRequisitionId: number,
    paymentRequiredBy: Date,
    items: RequisitionItem[]
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
            referenceId
            headline
            status
            project {
                id
            }
        }
    }`;