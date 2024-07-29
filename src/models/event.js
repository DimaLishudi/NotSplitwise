import { db } from "../config/db.js"
import { HTTPError } from "../errors/errors.js";

export async function createEvent() {
    const { id } = (await db("events").insert({}, "id"))[0];
    return id;
}

export async function getEventInfo(event_id) {
    const res = await db.transaction(async (trx) => {
        const rows = (await trx
            .select("total_spent", "total_paid", "finalised")
            .from("events")
            .where("id", event_id));

        if (rows.length === 0) {
            throw new HTTPError(404, `Event ${event_id} not found`);
        }
        // const {id, total_spent, total_paid, finalised} = row;

        const users = await trx
            .select("users.id as user_id", "username", "spent", "paid")
            .from("users_events")
            .join("users", "users.id", "=", "users_events.user_id")
            .where("event_id", event_id);
        
        return {...(rows[0]), users};
    });

    console.log(res.id);
    return res;
}

export async function updateEventInfo(id, data) {
    const res = await db.transaction(async (trx) => {
        const rows = data.users.map(({spent, user_id, paid}) => {
            const out = {user_id, spent, paid, event_id: id};
            return out;
        })
        console.log(rows);
        await trx
            .insert(rows)
            .into("users_events")
            .onConflict(["user_id", "event_id"])
            .merge();
        
        // on conflict().merge() to turn insert into update if data already existed
        // (upsert operation)

        let total_spent = 0;
        let total_paid = 0;
        for (let user of data.users) {
            total_spent += user.spent;
            total_paid += user.paid;
        }

        await trx
            .update({total_spent, total_paid})
            .into("events")
            .where("id", id);
    });
    return res;
}

export async function getEventDebts(id) {
    const res = await db.transaction(async (trx) => {
        await trx
            .select(["user_from", "user_to", "amount"], )
            .from("debts")
        
        // on conflict().merge() to turn insert into update if data already existed
        // (upsert operation)

        let total_spent = 0;
        let total_paid = 0;
        for (let user of data.users) {
            total_spent += user.spent;
            total_paid += user.paid;
        }

        await trx
            .update({total_spent, total_paid})
            .into("events")
            .where("id", data.id);
        
    });
    return res;
}

export async function finaliseEvent(debt_data) {
    await db.transaction(async (trx) => {
        await trx("events").update(
            {finalized: true}
        );

        await trx
            .insert(debt_data)
            .into("debts");
            // .onConflict(["user_from", "user_to"])
            // .merge();
    });
}

