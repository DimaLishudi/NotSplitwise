import express from "express";

import * as controllers from "../../controllers/users.js";

export const router = express.Router();

// This is just for debugging
// Returns [{"id" : A, "username" : B}, ...]
router.get("/", controllers.getAllUsers);

// returns JSON: {
//     "debts" : [
//         {
//             "user_from" : String
//             "user_to" : String,
//             "amount" : Integer,
//         },
//         ...
//     ],
// }
router.get("/:id", controllers.getUser);