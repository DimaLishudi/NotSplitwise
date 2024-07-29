import express from "express"
import { router as loginRouter } from "./api/login.js"
import { router as userAPIRouter } from "./api/users.js"
import { router as eventAPIRouter } from "./api/event.js"

export const router = express.Router()

router.use("/", loginRouter);
router.use("/users", userAPIRouter);
router.use("/events", eventAPIRouter);
