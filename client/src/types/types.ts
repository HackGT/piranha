import moment from "moment";
import { RequisitionItem, RequisitionStatus } from "../generated/types";

export enum UserAccessLevel {
    NONE = "NONE",
    MEMBER = "MEMBER",
    EXEC = "EXEC",
    ADMIN = "ADMIN"
}

export type RequisitionFormData = {
    headline: string;
    project: string;
    description: string;
    vendor?: string | undefined;
    budget: string | undefined;
    paymentRequiredBy: moment.Moment | null;
    otherFees: string;
    isReimbursement: boolean;
    items: RequisitionItem[];
    status: RequisitionStatus;
    files: any[];
    purchaseDate: moment.Moment | null;
}