import { ApprovalInclude, BudgetInclude, PaymentInclude, ProjectInclude, RequisitionInclude } from "@prisma/client"

export const PROJECT_INCLUDE: ProjectInclude = {
    leads: true,
    requisitions: {
        include: {
            project: {
                include: {
                    leads: true
                }
            },
            items: true,
            createdBy: true
        }
    }
}

export const REQUISITION_INCLUDE: RequisitionInclude = {
    budget: true,
    createdBy: true,
    fundingSource: true,
    approvals: {
        include: {
            approver: true
        }
    },
    files: true,
    payments: {
        include: {
            fundingSource: true
        }
    },
    items: {
        include: {
            lineItem: {
                include: {
                    category: true
                }
            },
            vendor: true
        }
    },
    project: {
        include: {
            leads: true,
            requisitions: true
        }
    }
}

export const BUDGET_INCLUDE: BudgetInclude = {
    categories: {
        include: {
            lineItems: true
        }
    }
}

export const APPROVAL_INCLUDE: ApprovalInclude = {
    requisition: {
        include: {
            approvals: {
                include: {
                    approver: true
                }
            }
        }
    }
}

export const PAYMENT_INCLUDE: PaymentInclude = {
    requisition: {
        include: {
            payments: {
                include: {
                    fundingSource: true
                }
            }
        }
    }
}