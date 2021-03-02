import { AccessLevel, RequisitionStatus, User } from "@prisma/client";
import { rule } from "graphql-shield";

const UNLOCKED_REQUISITION_STATUSES = [RequisitionStatus.DRAFT, RequisitionStatus.PENDING_CHANGES];


// HELPER METHODS
export const isExec = (user: any) => [AccessLevel.EXEC, AccessLevel.ADMIN].includes(user.accessLevel)

export const isProjectLead = (user: any, requisition: any) => {
    const projectLeads = requisition.project.leads.map((lead: any) => lead.id);

    return projectLeads.includes(user.id);
}


// PERMISSION METHODS FOR GRAPHQL
export const canEdit = (parent: any, args: any, context: { user: User }) => (
    isExec(context.user)
    || isProjectLead(context.user, parent)
    || (UNLOCKED_REQUISITION_STATUSES.includes(parent.status) && context.user.id === parent.createdBy.id) // Requisition is unlocked and user is the creator
)

export const canCancel = (parent: any, args: any, context: { user: User }) => isExec(context.user)

export const canExpense = (parent: any, args: any, context: { user: User }) => (
    isExec(context.user)
    || (isProjectLead(context.user, parent) && [RequisitionStatus.DRAFT, RequisitionStatus.PENDING_CHANGES, RequisitionStatus.SUBMITTED].includes(parent.status))
)

export const canViewAdminPanel = (parent: any, args: any, context: { user: User }) => isExec(context.user)


// RULES FOR GRAPHQL SHIELD
export const isAuthenticatedRule = rule({ cache: 'contextual' })(
    async (parent: any, args: any, context: { user: User }) => context.user !== null && context.user.accessLevel !== AccessLevel.NONE,
);

export const isExecRule = rule({ cache: 'contextual' })(
    async (parent: any, args: any, context: { user: User }) => isExec(context.user),
);

export const canEditRule = rule()(canEdit);

export const canExpenseRule = rule()(canExpense);

export const fallbackRule = rule({ cache: false })(
    async (parent, args, ctx, info) => {
        switch (info.parentType.name) {
            case 'Query':
            case 'Mutation':
                return false;
            default: // Allow types and fields
                return true;
        }
    }
);
