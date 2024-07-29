import knex from "knex";
import "dotenv/config";
import dotenv from "dotenv";

dotenv.config();
const {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    PGPORT 
} = process.env;

// .env contents example:
// PGHOST = "localhost"
// PGDATABASE = "MYDBNAME"
// PGUSER = "postgres"
// PGPASSWORD = "qwerty"
// PGPORT = "5432"
// PORT = "5000"

export const db = knex({
    client: 'pg',
    version: '7.2',
    connection: {
      host : PGHOST,
      user : PGUSER,
      password : PGPASSWORD,
      database : PGDATABASE,
      port: PGPORT,
    //   ssl: {rejectUnauthorized: false},
    },
});


// FOR DEBUG: drop all tables
    // await db.schema.dropTableIfExists("debts");
    // await db.schema.dropTableIfExists("users_events");
    // await db.schema.dropTableIfExists("events");
    // await db.schema.dropTableIfExists("hashpwd");
    // await db.schema.dropTableIfExists("users");

if (!(await db.schema.hasTable("users"))) {
    console.log("Creating users table...");
    await db.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("email", 64);
        table.string("username", 64).unique();
    });
}

// I do not add username column here
// As I think it is safer to not store username and (hashed) password in the same table
if (!(await db.schema.hasTable("hashpwd"))) {
    console.log("Creating passwords table...");
    await db.schema.createTable("hashpwd", (table) => {
        table.increments("user_id").primary();
        table.foreign("user_id")
            .references("users.id")
            .deferrable("deferred")
            .onDelete("CASCADE");
        table.string("password", 128);
    });
}

if (!(await db.schema.hasTable("events"))) {
    console.log("Creating events table...");
    await db.schema.createTable("events", (table) => {
        table.increments("id").primary();
        table.bigInteger("total_spent")
            .defaultTo(0);
        table.bigInteger("total_paid")
            .defaultTo(0);
        table.boolean("finalised").defaultTo(false);
    });
}

// users <-> events
if (!(await db.schema.hasTable("users_events"))) {
    console.log("Creating users_events table...");
    await db.schema.createTable("users_events", (table) => {
        table.increments("id").primary();
        table.integer("event_id")
            .references("events.id")
            .deferrable("deferred");
        table.integer("user_id")
            .references("users.id")
            .deferrable("deferred");
        table.unique(["event_id", "user_id"])
        table.bigInteger("spent")
            .defaultTo(0);
        table.bigInteger("paid")
            .defaultTo(0);
    });
}

// users <-> users debts
// debt can be negative
// user_from < user_to
if (!(await db.schema.hasTable("debts"))) {
    console.log("Creating debts table...");
    await db.schema.createTable("debts", (table) => {
        table.increments("id").primary();
        table.integer("event_id")
            .references("events.id")
            .deferrable("deferred");
        table.integer("id_from")
            .references("users.id")
            .deferrable("deferred");
        table.integer("id_to")
            .references("users.id")
            .deferrable("deferred");
        table.unique(["id_from", "id_to"])
        table.bigInteger("amount")
            .defaultTo(0);
    });
}
