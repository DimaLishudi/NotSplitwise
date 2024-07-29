import * as model from "../models/event.js"
import {resolveError, checkRequestFields} from "../errors/errors.js"


export function createEvent(req, res) {
    model.createEvent()
        .then(res.json.bind(res))
        .catch(err => resolveError(res, err));
}

export async function getEventInfo(req, res) {
    try {
        const eventInfo = await model.getEventInfo(req.params.id);
        if (eventInfo.finalised) {
            eventInfo.debts = await model.getEventDebts(req.params.id);
        }
        res.json(eventInfo);
    } catch(err) {
        resolveError(res, err);
    }
}

export async function updateEventInfo(req, res) {
    try {
        res.json(await model.updateEventInfo(req.params.id, req.body));
    } catch (err) {
        resolveError(res, err);
    }
}
    
export async function finaliseEvent(req, res) {
    try {
        checkRequestFields(req, ["id"]);
        const eventInfo = await model.getEventInfo(req.params.id);
        if (eventInfo.finalised) {
            res.status(400).send("Event already finalised");
            return;
        }
        if (eventInfo.total_spent != eventInfo.total_paid) {
            res.status(400).send("Total spent should be equal to total_paid");
            return;
        }

        const debtData = calcDebtData(eventInfo);
        await model.finaliseEvent(processDebtDataForDB(debtData));
        sortDebtData(debtData);

        return debtData;
    } catch (err) {
        resolveError(res, err);
    }
}


function calcUsersBalances(eventInfo) {
    const negative = []
    const positive = []
    for (let {user_id, username, spent, paid} of eventInfo.users) {
        const balance = paid - spent;
        if (balance > 0) {
            positive.push({user_id, username, balance});
        } else if (balance < 0) {
            negative.push({user_id, username, balance: -balance});
        }
    }
    // sort in descending order
    positive.sort(({balance: balance_a}, {balance: balance_b}) => balance_b - balance_a);
    negative.sort(({balance: balance_a}, {balance: balance_b}) => balance_b - balance_a);
    return {negative, positive};
}

function calcDebtData(eventInfo) {
    const {negative, positive} = calcUsersBalances(eventInfo);
    const debtData = []

    let neg_idx = 0;
    let pos_idx = 0;
    while (neg_idx < negative.length && pos_idx < positive.length) {
        const transfer = Math.min(negative[neg_idx].balance, positive[pos_idx].balance);
        negative[neg_idx].balance -= transfer;
        positive[pos_idx].balance -= transfer;

        debtData.push({
            user_from: negative[neg_idx].user_id,
            user_to: positive[pos_idx].user_id,
            name_from: negative[neg_idx].username,
            name_to: positive[pos_idx].username,
            amount: transfer
        });

        if (negative.balance === 0) {
            ++neg_idx;
        }
        if (positive.balance === 0) {
            ++pos_idx;
        }
    }
    console.log(neg_idx, negative.length, pos_idx, positive.length);

    return debtData;
}

function processDebtDataForDB(debtData) {
    return [debtData].map(
        ({user_from, user_to, amount}) => 
            user_from < user_to ? {user_from, user_to, amount} : {user_to, user_from, amount: -amount}
    );
}

function sortDebtData(debtData) {
    debtData.sort(({name_from: from_a, name_to: to_a}, {name_from: from_b, name_to: to_b}) => {
        // sort lexicographically (from is first priority, to is second priority)
        return 2 * from_a.toLocaleUpperCase().localeCompare(from_b.toLocaleUpperCase())
                + to_a.toLocaleUpperCase().localeCompare(to_b.toLocaleUpperCase())
    });
}