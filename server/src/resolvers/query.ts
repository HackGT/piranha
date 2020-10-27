import { GraphQLError } from 'graphql';
import { User } from "@prisma/client";

import { BUDGET_INCLUDE, PROJECT_INCLUDE, REQUISITION_INCLUDE } from "./common";
import { prisma } from '../common';
import { QueryPaymentMethodsArgs, QueryProjectArgs, QueryProjectsArgs, QueryRequisitionArgs, QueryVendorArgs, QueryVendorsArgs } from '../generated/types';

const user = async function (parent: any, args: any, context: { user: User }) {
    let user = await prisma.user.findOne({
        where: {
            uuid: context.user.uuid
        }
    });

    if (!user) {
        throw new GraphQLError("User not found");
    }

    return user;
};

const users = async function (parent: any, args: any) {
    return await prisma.user.findMany();
};

const project = async function (parent: any, args: QueryProjectArgs) {
    const project = await prisma.project.findFirst({
        where: args,
        include: {
            ...PROJECT_INCLUDE
        }
    });

    return project;
};

const projects = async function (parent: any, args: QueryProjectsArgs) {
    return await prisma.project.findMany({
        include: {
            ...PROJECT_INCLUDE
        }
    });
};

const vendor = async function (parent: any, args: QueryVendorArgs) {
    return await prisma.vendor.findOne({
        where: args
    });
};

const vendors = async function (parent: any, args: QueryVendorsArgs) {
    return await prisma.vendor.findMany({
        where: {
            isActive: args.isActive || undefined
        }
    });
};

const requisition = async function (parent: any, args: QueryRequisitionArgs, context: { user: User }) {
    return await prisma.requisition.findFirst({
        where: {
            project: {
                year: args.year,
                shortCode: args.shortCode
            },
            projectRequisitionId: args.projectRequisitionId
        },
        include: {
            ...REQUISITION_INCLUDE
        }
    });
};

const requisitions = async function (parent: any, args: any, context: { user: User }) {
    return await prisma.requisition.findMany({
        where: {
            createdBy: {
                id: context.user.id
            }
        },
        include: {
            ...REQUISITION_INCLUDE
        }
    })
};

const paymentMethods = async function (parent: any, args: QueryPaymentMethodsArgs) {
    return await prisma.paymentMethod.findMany({
        where: {
            isActive: args.isActive || undefined
        }
    });
};

const budgets = async function (parent: any, args: any) {
    return await prisma.budget.findMany({
        include: {
            ...BUDGET_INCLUDE
        }
    });
};

export const Query = {
    user: user,
    users: users,
    project: project,
    projects: projects,
    vendor: vendor,
    vendors: vendors,
    requisition: requisition,
    requisitions: requisitions,
    paymentMethods: paymentMethods,
    budgets: budgets
}