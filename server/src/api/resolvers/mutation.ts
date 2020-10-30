import { GraphQLError } from 'graphql';
import { User, RequisitionStatus } from "@prisma/client";

import { uploadFiles } from "../../util/googleUpload";
import { sendSlackNotification } from "../../util/slack";
import { APPROVAL_INCLUDE, PAYMENT_INCLUDE, PROJECT_INCLUDE, REQUISITION_INCLUDE } from './common';
import { prisma } from '../../common';
import { MutationCreateApprovalArgs, MutationCreatePaymentArgs, MutationCreatePaymentMethodArgs, MutationCreateProjectArgs, MutationCreateRequisitionArgs, MutationCreateVendorArgs, MutationResolvers, MutationUpdatePaymentMethodArgs, MutationUpdateProjectArgs, MutationUpdateRequisitionArgs, MutationUpdateUserArgs, MutationUpdateVendorArgs } from '../../generated/types';


const updateUser = async function (parent: any, args: MutationUpdateUserArgs, context: { user: User }) {
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
        ...item.lineItem && { lineItem: { connect: { id: item.lineItem } } },
        ...item.vendor && { vendor: { connect: { id: item.vendor } } }
    }))

    let requisition = await prisma.requisition.create({
        data: {
            ...data,
            projectRequisitionId: aggregate.max.projectRequisitionId + 1,
            ...data.fundingSource && { fundingSource: { connect: { id: data.fundingSource } } },
            ...data.budget && { budget: { connect: { id: data.budget } } },
            ...data.project && { project: { connect: { id: data.project } } },
            createdBy: { connect: { id: context.user.id } },
            items: { create: createItems },
            files: undefined
        },
        include: {
            ...REQUISITION_INCLUDE
        }
    });

    if (requisition.status != RequisitionStatus.DRAFT) {
        sendSlackNotification(requisition);
    }

    await uploadFiles(data.files?.map((file: any) => file.originFileObj), requisition);

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
                        ...newItems[index].vendor && { vendor: { connect: { id: newItems[index].vendor } } },
                        ...(!newItems[index].vendor && oldItems[index].vendorId) && { vendor: { disconnect: true } },
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
                        ...newItems[index].vendor && { vendor: { connect: { id: newItems[index].vendor } } },
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

    if (data.files) {
        let filesToUpload = [];
        let existingFileIds: any[] = [];

        for (let file of data.files) {
            if (file.originFileObj) {
                filesToUpload.push(file.originFileObj);
            } else if (file.id) {
                existingFileIds.push(file.id);
            }
        }
        await uploadFiles(filesToUpload, oldRequisition);

        const oldFileIds = oldRequisition.files.filter(file => file.isActive).map(file => file.id);

        for (let inactiveFileId of oldFileIds.filter(id => !existingFileIds.includes(id))) {
            await prisma.file.update({
                where: {
                    id: inactiveFileId
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
            ...data.fundingSource && { fundingSource: { connect: { id: data.fundingSource } } },
            ...data.budget && { budget: { connect: { id: data.budget } } },
            ...data.project && { project: { connect: { id: data.project } } },
            ...itemIds.length != 0 && { items: { set: itemIds.map(id => ({ id })) } },
            files: undefined
        },
        include: {
            ...REQUISITION_INCLUDE
        }
    });

    if (requisition.status != oldRequisition.status) {
        sendSlackNotification(requisition);
    }

    return requisition;
}

const createProject = async function (parent: any, args: MutationCreateProjectArgs, context: { user: User }) {
    return await prisma.project.create({
        data: {
            ...args.data,
            archived: args.data.archived || false,
            leads: {
                connect: args.data.leads.map(lead => ({ id: lead }))
            }
        },
        include: {
            ...PROJECT_INCLUDE
        }
    });
}

const updateProject = async function (parent: any, args: MutationUpdateProjectArgs, context: { user: User }) {
    return await prisma.project.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            archived: args.data.archived || false,
            leads: {
                connect: args.data.leads.map(lead => ({ id: lead }))
            }
        },
        include: {
            ...PROJECT_INCLUDE
        }
    });
}

const createVendor = async function (parent: any, args: MutationCreateVendorArgs, context: { user: User }) {
    return await prisma.vendor.create({
        data: {
            ...args.data,
            isActive: args.data.isActive || true,
        }
    });
}

const updateVendor = async function (parent: any, args: MutationUpdateVendorArgs, context: { user: User }) {
    return await prisma.vendor.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            isActive: args.data.isActive || true
        }
    });
}

const createPaymentMethod = async function (parent: any, args: MutationCreatePaymentMethodArgs, context: { user: User }) {
    return await prisma.paymentMethod.create({
        data: {
            ...args.data,
            isActive: args.data.isActive || true,
            isDirectPayment: args.data.isActive || false
        }
    });
}

const updatePaymentMethod = async function (parent: any, args: MutationUpdatePaymentMethodArgs, context: { user: User }) {
    return await prisma.paymentMethod.update({
        where: {
            id: args.id
        },
        data: {
            ...args.data,
            isActive: args.data.isActive || true,
            isDirectPayment: args.data.isActive || false
        }
    });
}

const createPayment = async function (parent: any, args: MutationCreatePaymentArgs, context: { user: User }) {
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
        include: {
            ...PAYMENT_INCLUDE
        }
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