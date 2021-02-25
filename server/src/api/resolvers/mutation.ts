import { GraphQLError } from 'graphql';
import { User } from "@prisma/client";

import { uploadFiles } from "../../util/googleUpload";
import { sendSlackNotification } from "../../util/slack";
import { APPROVAL_INCLUDE, connectOrDisconnect, connectOrUndefined, PAYMENT_INCLUDE, PROJECT_INCLUDE, REQUISITION_INCLUDE } from './common';
import { prisma } from '../../common';
import { MutationCreateApprovalArgs, MutationCreatePaymentArgs, MutationCreatePaymentMethodArgs, MutationCreateProjectArgs, MutationCreateRequisitionArgs, MutationCreateVendorArgs, MutationCreateBudgetArgs, MutationUpdatePaymentMethodArgs, MutationUpdateProjectArgs, MutationUpdateRequisitionArgs, MutationUpdateUserArgs, MutationUpdateVendorArgs, MutationUpdateBudgetArgs, MutationCreateLineItemArgs, MutationUpdateLineItemArgs} from '../../generated/types';

const updateUser = async function (parent: any, args: MutationUpdateUserArgs) {
    return await prisma.user.update({
        where: {
            id: args.id
        },
        data: args.data
    });
}

const createRequisition = async function (parent: any, args: MutationCreateRequisitionArgs, context: { user: User }) {
    let aggregate = await prisma.requisition.aggregate({
        max: {
            projectRequisitionId: true
        },
        where: {
            projectId: args.data.project!
        }
    });

    const data = args.data;

    const createItems = data.items?.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        link: item.link,
        notes: item.notes,
        lineItem: connectOrUndefined(item.lineItem),
        vendor: connectOrUndefined(item.vendor)
    }));

    let requisition = await prisma.requisition.create({
        data: {
            ...data,
            isReimbursement: data.isReimbursement || undefined,
            projectRequisitionId: aggregate.max.projectRequisitionId + 1,
            fundingSource: connectOrUndefined(data.fundingSource),
            budget: connectOrUndefined(data.budget),
            project: { connect: { id: data.project || undefined } },
            createdBy: { connect: { id: context.user.id } },
            items: { create: createItems },
            files: undefined
        },
        include: REQUISITION_INCLUDE
    });

    await sendSlackNotification(requisition.id);
    await uploadFiles(data.files?.map((file: any) => file.originFileObj), requisition);

    return requisition;
}

const updateRequisition = async function (parent: any, args: MutationUpdateRequisitionArgs) {
    let oldRequisition = await prisma.requisition.findFirst({
        where: {
            id: args.id
        },
        include: {
            files: true,
            items: true
        }
    });

    if (!oldRequisition) {
        throw new GraphQLError("Requisition not found");
    }

    const data = args.data;

    let itemIds = [];
    if (data.items) {
        let index = 0;
        let oldItems = oldRequisition.items;
        let newItems = data.items;

        while (index < oldItems.length || index < newItems.length) {
            if (index < oldItems.length && index < newItems.length) {
                const item = await prisma.requisitionItem.update({
                    where: {
                        id: oldItems[index].id
                    },
                    data: {
                        ...newItems[index],
                        vendor: connectOrDisconnect(newItems[index].vendor, oldItems[index].vendorId),
                        lineItem: connectOrDisconnect(newItems[index].lineItem, oldItems[index].lineItemId)
                    }
                });
                itemIds.push(item.id);
            } else if (index < oldItems.length) {
                await prisma.requisitionItem.delete({
                    where: {
                        id: oldItems[index].id
                    }
                });
            } else if (index < newItems.length) {
                const item = await prisma.requisitionItem.create({
                    data: {
                        ...newItems[index],
                        vendor: connectOrUndefined(newItems[index].vendor),
                        lineItem: connectOrUndefined(newItems[index].lineItem),
                        requisition: { connect: { id: oldRequisition.id } }
                    }
                });
                itemIds.push(item.id);
            }
            index++;
        }
    }

    if (data.files) {
        let filesToUpload = [];
        let existingFileIds: any[] = [];

        for (let file of data.files) {
            if (file.originFileObj) {
                filesToUpload.push(file.originFileObj);
            } else if (file.id) {
                existingFileIds.push(parseInt(file.id));
            }
        }

        await uploadFiles(filesToUpload, oldRequisition);

        for (let inactiveFile of oldRequisition.files.filter(file => file.isActive && !existingFileIds.includes(file.id))) {
            await prisma.file.update({
                where: {
                    id: inactiveFile.id
                },
                data: {
                    isActive: false
                }
            });
        }
    }

    let requisition = await prisma.requisition.update({
        where: {
            id: args.id
        },
        data: {
            ...data,
            isReimbursement: data.isReimbursement || undefined,
            fundingSource: connectOrUndefined(data.fundingSource),
            budget: connectOrUndefined(data.budget),
            project: connectOrUndefined(data.project),
            items: itemIds.length == 0 ? undefined : { set: itemIds.map(id => ({ id })) },
            files: undefined
        },
        include: REQUISITION_INCLUDE
    });

    if (requisition.status != oldRequisition.status) {
        sendSlackNotification(requisition.id);
    }

    return requisition;
}

const createProject = async function (parent: any, args: MutationCreateProjectArgs) {
    return await prisma.project.create({
        data: {
            ...args.data,
            archived: args.data.archived || false,
            leads: {
                connect: args.data.leads.map(lead => ({ id: lead }))
            }
        },
        include: PROJECT_INCLUDE
    });
}

const updateProject = async function (parent: any, args: MutationUpdateProjectArgs) {
    return await prisma.project.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            archived: args.data.archived || undefined,
            leads: {
                connect: args.data.leads.map(lead => ({ id: lead }))
            }
        },
        include: PROJECT_INCLUDE
    });
}

const createVendor = async function (parent: any, args: MutationCreateVendorArgs) {
    return await prisma.vendor.create({
        data: {
            ...args.data,
            isActive: args.data.isActive || true,
        }
    });
}

const updateVendor = async function (parent: any, args: MutationUpdateVendorArgs) {
    return await prisma.vendor.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            isActive: args.data.isActive || undefined
        }
    });
}

const createBudget = async function (parent: any, args: MutationCreateBudgetArgs) {
    return await prisma.budget.create({
        data: {
            ...args.data
        }
    });
}

const updateBudget = async function (parent: any, args: MutationUpdateBudgetArgs) {
    return await prisma.budget.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data
        }
    });
}

const createPaymentMethod = async function (parent: any, args: MutationCreatePaymentMethodArgs) {
    return await prisma.paymentMethod.create({
        data: {
            ...args.data,
            isActive: args.data.isActive || true,
            isDirectPayment: args.data.isActive || false
        }
    });
}

const updatePaymentMethod = async function (parent: any, args: MutationUpdatePaymentMethodArgs) {
    return await prisma.paymentMethod.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            isActive: args.data.isActive || undefined,
            isDirectPayment: args.data.isActive || undefined
        }
    });
}

const createPayment = async function (parent: any, args: MutationCreatePaymentArgs) {
    return await prisma.payment.create({
        data: {
            ...args.data,
            requisition: {
                connect: {
                    id: args.data.requisition
                }
            },
            fundingSource: {
                connect: {
                    id: args.data.fundingSource
                }
            }
        },
        include: PAYMENT_INCLUDE
    })
}

const createApproval = async function (parent: any, args: MutationCreateApprovalArgs, context: { user: User }) {
    return await prisma.approval.create({
        data: {
            ...args.data,
            requisition: {
                connect: {
                    id: args.data.requisition
                }
            },
            approver: {
                connect: {
                    id: context.user.id
                }
            }
        },
        include: APPROVAL_INCLUDE
    })
}

const createLineItem = async function (parent: any, args: MutationCreateLineItemArgs) {
    return await prisma.lineItem.create({
        data: {
            ...args.data,
            category: {
                connect: {
                    id: args.data.category
                }
            }
        }
    });
}

const updateLineItem = async function (parent: any, args: MutationUpdateLineItemArgs) {
    return await prisma.lineItem.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            category: {
                connect: {
                    id: args.data.category
                }
            }
        }
    });
}

export const Mutation = {
    updateUser: updateUser,

    createRequisition: createRequisition,
    updateRequisition: updateRequisition,

    createProject: createProject,
    updateProject: updateProject,

    createVendor: createVendor,
    updateVendor: updateVendor,

    createPaymentMethod: createPaymentMethod,
    updatePaymentMethod: updatePaymentMethod,

    createBudget: createBudget,
    updateBudget: updateBudget,

    createPayment: createPayment,
    createApproval: createApproval,

    createLineItem: createLineItem,
    updateLineItem: updateLineItem
}
