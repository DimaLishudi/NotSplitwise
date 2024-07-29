import express from "express";

import { registerUser, loginUser } from "../../controllers/login.js";

export const router = express.Router();

// RECIEVES JSON body: {username: A, password: B}
// RETURNS JSON with body: {username: A, password: B, ID: C}
router.post("/register", registerUser);

// RECIEVES JSON body: {username: A, password: B}
// RETURNS JSON with body: {username: A, password: B, ID: C}
router.post("/login", loginUser);