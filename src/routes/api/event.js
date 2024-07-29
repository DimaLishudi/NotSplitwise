import express from "express";

import * as controllers from "../../controllers/event.js";

export const router = express.Router();


// Returns JSON { "id" : integer }  -- where A is event_id
router.post("/", controllers.createEvent);

// Returns JSON {
//     "total_spent": integer,
//     "total_paid": integer,
//     "finalised": Boolean,
//     "users": [
//         {
//             user_id : Boolean,
//             username : String,
//             spent: integer,
//             paid: integer
//         }
//     ],

// }
router.get("/:id", controllers.getEventInfo);


// Recieves JSON with key "users" - array in the body (with the same structure as in getEventInfo)

// {
//     "users": [
//         {
//             user_id : Boolean,
//             username : String,
//             spent: integer,
//             paid: integer
//         }
//     ]
// }
router.put("/:id", controllers.updateEventInfo);

router.post("/:id", controllers.finaliseEvent);