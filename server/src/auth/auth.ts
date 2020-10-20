import mongoose from "mongoose";
import express from "express";
import passport from "passport";
import session from "express-session";
import connectMongo from 'connect-mongo';
import dotenv from "dotenv";

import { app } from "../app";
import { IUser, User } from "../schema";
import { GroundTruthStrategy } from "./strategies";

dotenv.config();
const MongoStore = connectMongo(session);

if (process.env.PRODUCTION === 'true') {
    app.enable("trust proxy");
}
else {
    console.warn("OAuth callback(s) running in development mode");
}

if (!process.env.SESSION_SECRET) {
    throw new Error("Session secret not specified");
}

app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(passport.initialize());
app.use(passport.session());

export function isAuthenticated(request: express.Request, response: express.Response, next: express.NextFunction): void {
    response.setHeader("Cache-Control", "private");
    if (!request.isAuthenticated() || !request.user) {
        if (request.session) {
            request.session.returnTo = request.originalUrl;
        }
        response.redirect("/auth/login");
    } else {
        next();
    }
}

const groundTruthStrategy = new GroundTruthStrategy(String(process.env.GROUND_TRUTH_URL));

passport.use(groundTruthStrategy);
passport.serializeUser<IUser, string>((user, done) => {
    done(null, user.uuid);
});
passport.deserializeUser<IUser, string>((id, done) => {
    User.findOne({ uuid: id }, (err, user) => {
        done(err, user!);
    });
});