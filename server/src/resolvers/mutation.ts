import { GraphQLError } from 'graphql';
import { User, RequisitionStatus } from "@prisma/client";

import { uploadFile } from "../util/googleUpload";
import { sendSlackNotification } from "../util/slack";
import { APPROVAL_INCLUDE, PAYMENT_INCLUDE, PROJECT_INCLUDE, REQUISITION_INCLUDE } from './common';
import { prisma } from '../common';


const updateUser = async function (parent: any, args: any) {
    return await prisma.user.update({
        where: {
            id: args.id
        },
        data: args.data
    });
}

const createRequisition = async function (parent: any, args: any, context: { user: User }) {
    let aggregate = await prisma.requisition.aggregate({
        max: {
            projectRequisitionId: true
        },
        where: {
            projectId: args.project
        }
    });

    const data = args.data;

    const createItems = data.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        link: item.link,
        notes: item.notes,
        ...item.lineItem && { lineItem: { connect: { id: item.lineItem } } }
    }))

    let requisition = await prisma.requisition.create({
        data: {
            ...data,
            projectRequisitionId: aggregate.max.projectRequisitionId + 1,
            ...data.fundingSource && { fundingSource: { connect: { id: data.fundingSource } } },
            ...data.budget && { budget: { connect: { id: data.budget } } },
            ...data.vendor && { vendor: { connect: { id: data.vendor } } },
            ...data.project && { project: { connect: { id: data.project } } },
            createdBy: { connect: { id: context.user.id } },
            items: { create: createItems }
        },
        include: {
            ...REQUISITION_INCLUDE
        }
    });

    if (requisition.status != RequisitionStatus.DRAFT) {
        sendSlackNotification(requisition);
    }

    for (const file of data.files || []) {
        uploadFile(file, requisition);
    }

    return requisition;
}

const updateRequisition = async function (parent: any, args: any) {
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
    if ("items" in data) {
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
                        ...newItems[index].lineItem && { lineItem: { connect: { id: newItems[index].lineItem } } },
                        ...(!newItems[index].lineItem && oldItems[index].lineItemId) && { lineItem: { disconnect: true } }
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
                        ...newItems[index].lineItem && { lineItem: { connect: { id: newItems[index].lineItem } } },
                        requisition: {
                            connect: {
                                id: oldRequisition.id
                            }
                        }
                    }
                });
                itemIds.push(item.id);
            }
            index++;
        }
    }

    let requisition = await prisma.requisition.update({
        where: {
            id: args.id
        },
        data: {
            ...data,
            ...data.fundingSource && { fundingSource: { connect: { id: data.fundingSource } } },
            ...data.budget && { budget: { connect: { id: data.budget } } },
            ...data.vendor && { vendor: { connect: { id: data.vendor } } },
            ...data.project && { project: { connect: { id: data.project } } },
            ...itemIds.length != 0 && { items: { set: itemIds.map(id => ({ id })) } }
        },
        include: {
            ...REQUISITION_INCLUDE
        }
    });

    if (requisition.status != oldRequisition.status) {
        sendSlackNotification(requisition);
    }

    if ("files" in data) {
        for (const file of data.files.filter((file: any) => !oldRequisition!.files.includes(file))) {
            console.log(file);
            uploadFile(file, requisition);
        }
    }

    return requisition;
}

const createProject = async function (parent: any, args: any) {
    return await prisma.project.create({
        data: {
            ...args.data,
            leads: {
                connect: args.data.leads.map((lead: any) => ({ id: lead }))
            }
        },
        include: {
            ...PROJECT_INCLUDE
        }
    });
}
const updateProject = async function (parent: any, args: any) {
    return await prisma.project.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            leads: {
                connect: args.data.leads.map((lead: any) => ({ id: lead }))
            }
        },
        include: {
            ...PROJECT_INCLUDE
        }
    });
}

const createVendor = async function (parent: any, args: any) {
    return await prisma.vendor.create({
        data: args.data
    });
}

const updateVendor = async function (parent: any, args: any) {
    return await prisma.vendor.update({
        where: {
            id: args.id
        },
        data: args.data
    });
}

const createPaymentMethod = async function (parent: any, args: any) {
    return await prisma.paymentMethod.create({
        data: args.data
    });
}

const updatePaymentMethod = async function (parent: any, args: any) {
    return await prisma.paymentMethod.update({
        where: {
            id: args.id
        },
        data: args.data
    });
}

const createPayment = async function (parent: any, args: any) {
    return await prisma.payment.create({
        data: {
            amount: args.data.amount,
            date: args.data.date,
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
        include: {
            ...PAYMENT_INCLUDE
        }
    })
}

const createApproval = async function (parent: any, args: any, context: { user: User }) {
    return await prisma.approval.create({
        data: {
            isApproving: args.data.isApproving,
            notes: args.data.notes,
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
        include: {
            ...APPROVAL_INCLUDE
        }
    })
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

    createPayment: createPayment,
    createApproval: createApproval
}