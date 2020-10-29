import { IResolvers } from "apollo-server-express";
import { GraphQLScalarType, Kind } from 'graphql';
import { User } from "@prisma/client";

import { canCancel, canEdit, canExpense, hasAdminAccess } from "../util/util";
import { Query } from "../resolvers/query";
import { Mutation } from "../resolvers/mutation";
import { getFileLink } from "../util/googleUpload";

export const resolvers: IResolvers = {
    Query: Query,
    Mutation: Mutation,
    ID: new GraphQLScalarType({
        name: 'ID',
        description: 'ID custom scalar type string to int',
        parseValue(value) {
            return parseInt(value); // value from the client
        },
        serialize(value) {
            return value.toString(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value); // ast value is always in string format
            }
            return null;
        },
    }),
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
            return new Date(value); // value from the client
        },
        serialize(value) {
            return value.toISOString(); // value sent to the client
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.INT) {
                return parseInt(ast.value, 10); // ast value is always in string format
            }
            return null;
        },
    }),
    User: {
        hasAdminAccess: (parent: any, args: any, context: { user: User }) => hasAdminAccess(context.user)
    },
    Requisition: {
        canEdit: (parent: any, args: any, context: { user: User }) => canEdit(context.user, parent),
        canCancel: (parent: any, args: any, context: { user: User }) => canCancel(context.user),
        canExpense: (parent: any, args: any, context: { user: User }) => canExpense(context.user, parent),
        referenceString: (parent: any) => `${parent.project.year}-${parent.project.shortCode}-${parent.projectRequisitionId}`,
        files: (parent: any) => parent.files.filter((file: any) => file.isActive) // Filter so only active files are sent to client
    },
    Project: {
        referenceString: (parent: any) => `${parent.year}-${parent.shortCode}`
    },
    File: {
        signedUrl: (parent: any) => getFileLink(parent)
    }
};