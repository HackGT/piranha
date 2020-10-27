import { AccessLevel, RequisitionStatus } from "@prisma/client";
import { ForbiddenError } from "apollo-server-express";

const UNLOCKED_REQUISITION_STATUSES = [RequisitionStatus.DRAFT, RequisitionStatus.PENDING_CHANGES];

const isExec = (user: any) => {
    return [AccessLevel.EXEC, AccessLevel.ADMIN].includes(user.accessLevel);
}

const isProjectLead = (user: any, requisition: any) => {
    const projectLeads = requisition.project.leads.map((user: any) => user.id);

    return projectLeads.includes(user.id);
}



export const canEdit = (user: any, requisition: any) => {
    return (
        isExec(user)
        || isProjectLead(user, requisition)
        || (UNLOCKED_REQUISITION_STATUSES.includes(requisition.status) && user.id == requisition.createdBy.id) // Requisition is unlocked and user is the creator
    )
}

export const canCancel = (user: any) => {
    return isExec(user);
}

export const canExpense = (user: any, requisition: any) => {
    return (
        isExec(user)
        || (isProjectLead(user, requisition) && [RequisitionStatus.DRAFT, RequisitionStatus.PENDING_CHANGES, RequisitionStatus.SUBMITTED].includes(requisition.status))
    )
}

export const hasAdminAccess = (user: any) => {
    return isExec(user);
}

export const checkAdminAccess = (context: any) => {
    if (!hasAdminAccess(context.user)) {
        throw new ForbiddenError("User is not an admin.")
    }
}