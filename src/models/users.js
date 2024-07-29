import { db } from "../config/db.js"
import { NotFoundError } from "../errors/errors.js";

class User {
    constructor(id, email, username, first_name, last_name) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
    }
};

export async function getUserInfo(id) {
    const out = await db("users")
        .select("id", "email", "username")
        .where("id", id)
        .first();
    if (out == undefined) {
        throw new NotFoundError(id);
    }
    return new User(id, out.email, out.username, out.first_name, out.last_name);
}

export async function getUserEvents(user_id) {
    const data = await db("users_events")
        .select("event_id")
        .where("user_id", user_id);
    return data;
}

export async function getUserDebts(user_id) {
    const data = await db
        .select("users.username", "amount")
        .from("debts")
        .where("id_from", user_id)
        .where("amount", ">", 0)
        .join("users", "users.id", "=", "debts.id_to")
    const data_inv = await db
        .select("users.username", "amount")
        .from("debts")
        .where("id_to", user_id)
        .where("amount", "<", 0)
        .join("users", "users.id", "=", "debts.id_from")
    data.push(...data_inv);
    return data;
}

export async function getAllUsers() {
    const data = await db("users")
        .select("id", "username");
    return data;
}

// export async function addUserDebt(user_from, user_to, debt) {
//     if (debt === 0) {
//         return;
//     }
//     if (from > to) {
//         debt = -debt;
//         [user_from, user_to] = [user_to, user_from];
//     }
//     const data = await db("debts")
//         .insert({user_from, user_to, debt});
//     return data;
// }


// export async function updateUser({id, email, username, first_name, last_name}) {
//     // TODO: check if nono
//     await db("users")
//         .update({id, email, username, first_name, last_name})
//         .where("id", id);
//         // .returning("id");
//     return new User(id, email, username, first_name, last_name);
// }
