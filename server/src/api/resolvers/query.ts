import { GraphQLError } from "graphql";
import { User } from "@prisma/client";

import { BUDGET_INCLUDE, PROJECT_INCLUDE, REQUISITION_INCLUDE } from "./common";
import { prisma } from "../../common";
import {
  QueryPaymentMethodsArgs,
  QueryProjectArgs,
  QueryRequisitionArgs,
  QueryVendorArgs,
  QueryVendorsArgs,
} from "../../generated/types";

const user = async function user(parent: any, args: any, context: { user: User }) {
  const prismaUser = await prisma.user.findUnique({
    where: {
      uuid: context.user.uuid,
    },
  });

  if (!prismaUser) {
    throw new GraphQLError("User not found");
  }

  return prismaUser;
};

const users = async function users() {
  return await prisma.user.findMany();
};

const project = async function project(parent: any, args: QueryProjectArgs) {
  return await prisma.project.findFirst({
    where: args,
    include: PROJECT_INCLUDE,
  });
};

const projects = async function projects() {
  return await prisma.project.findMany({
    include: PROJECT_INCLUDE,
  });
};

const vendor = async function vendor(parent: any, args: QueryVendorArgs) {
  return await prisma.vendor.findUnique({
    where: args,
  });
};

const vendors = async function vendors(parent: any, args: QueryVendorsArgs) {
  return await prisma.vendor.findMany({
    where: {
      isActive: args.isActive || undefined,
    },
  });
};

const requisition = async function requisition(parent: any, args: QueryRequisitionArgs) {
  return await prisma.requisition.findFirst({
    where: {
      project: {
        year: args.year,
        shortCode: args.shortCode,
      },
      projectRequisitionId: args.projectRequisitionId,
    },
    include: REQUISITION_INCLUDE,
  });
};

const requisitions = async function requisitions(parent: any, args: any, context: { user: User }) {
  return await prisma.requisition.findMany({
    where: {
      createdBy: {
        id: context.user.id,
      },
    },
    include: REQUISITION_INCLUDE,
  });
};

const paymentMethods = async function paymentMethods(parent: any, args: QueryPaymentMethodsArgs) {
  return await prisma.paymentMethod.findMany({
    where: {
      isActive: args.isActive || undefined,
    },
  });
};

const budgets = async function budgets() {
  return await prisma.budget.findMany({
    include: BUDGET_INCLUDE,
  });
};

export const Query = {
  user,
  users,
  project,
  projects,
  vendor,
  vendors,
  requisition,
  requisitions,
  paymentMethods,
  budgets,
};
