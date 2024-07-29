import bcrypt from "bcrypt";

import * as model from "../models/login.js";
import {resolveError, checkRequestFields} from "../errors/errors.js";


const SALTROUNDS = parseInt(process.env.SALTROUNDS);

export async function registerUser(req, res) {
    try {
        checkRequestFields(req, ["password", "username"])
        const {username, password} = req.body;
        const hash = await bcrypt.hash(password, SALTROUNDS);
        const id = await model.registerUser(req.body, hash);
        res.json({username, id, password});
    } catch (err) {
        if (err.constraint == "users_username_unique") {
            res.status(400).send("Username already taken");
            return;
        }
        resolveError(res, err);
    }
}

export async function loginUser(req, res) {
    try {
        checkRequestFields(req, ["username", "password"]);
        const { username, password } = req.body;
        const { id, password: hash} = await model.getPasswordHash(username);
        if (await bcrypt.compare(password, hash)) {
            res.json({username, id, password});
            return;
        }
        res.status(401).send("Incorrect password");
    } catch (err) {
        resolveError(res, err);
    }
}
