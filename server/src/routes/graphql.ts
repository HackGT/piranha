import { IResolvers } from "apollo-server-express";
import { IUser, User } from "../schema";

const getUser = async function (parent: any, args: any, context: { user: IUser }) {
    let user = await User.findById(context.user._id);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};


export const resolvers: IResolvers = {
    Query: {
        user: getUser
    }
};