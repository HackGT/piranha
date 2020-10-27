import { GraphQLError } from 'graphql';
import { User } from "@prisma/client";

import { BUDGET_INCLUDE, PROJECT_INCLUDE, REQUISITION_INCLUDE } from "./common";
import { prisma } from '../common';

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

const project = async function (parent: any, args: any) {
    const project = await prisma.project.findFirst({
        where: args,
        include: {
            ...PROJECT_INCLUDE
        }
    });

    return project;
};

const projects = async function (parent: any, args: any) {
    return await prisma.project.findMany({
        include: {
            ...PROJECT_INCLUDE
        }
    });
};

const vendor = async function (parent: any, args: any) {
    return await prisma.vendor.findOne({
        where: args
    });
};

const vendors = async function (parent: any, args: any) {
    return await prisma.vendor.findMany({
        where: args
    });
};

const requisition = async function (parent: any, args: { year: number, shortCode: string, projectRequisitionId: number }, context: { user: User }) {
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

const paymentMethods = async function (parent: any, args: any) {
    return await prisma.paymentMethod.findMany({
        where: args
    });
};

const budgets = async function (parent: any, args: any) {
    return await prisma.budget.findMany({
        where: args,
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