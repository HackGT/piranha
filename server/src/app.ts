/* eslint-disable import/first */
import fs from "fs";
import path from "path";
import express, { Request } from "express";
import compression from "compression";
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"
import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express';
import { applyMiddleware } from "graphql-middleware";

dotenv.config();

const VERSION_NUMBER = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")).version;

export const app = express();

app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(cors());

import { isAuthenticated } from "./auth/auth";
import { authRoutes } from "./routes/auth";

app.get("/status", (req, res) => {
    res.status(200).send("Success");
});

app.use("/auth", authRoutes);

import { resolvers, permissions } from "./api/api";

const typeDefs = gql`
    ${fs.readFileSync(path.resolve(__dirname, "./api.graphql"), "utf8")}
`;

const schema = applyMiddleware(
    makeExecutableSchema({ typeDefs, resolvers }),
    permissions
);

const server = new ApolloServer({
    schema,
    context: ({ req }: { req: Request }) => ({ user: req.user }),
    playground: process.env.PRODUCTION !== "true" && {
        settings: {
            "editor.theme": "dark",
            "request.credentials": "include",
        },
    },
    introspection: process.env.PRODUCTION !== "true",
    formatError: (err) => {
        console.error(err);
        return err;
    },
});

app.use(isAuthenticated);
server.applyMiddleware({ app });

app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Piranha system v${VERSION_NUMBER} started on port ${process.env.PORT || 3000}`);
});
