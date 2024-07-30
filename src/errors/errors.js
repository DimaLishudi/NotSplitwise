export class HTTPError extends Error {
    constructor(status, response_message, message=null) {
        if (message === null) {
            message = response_message;
        }
        super(message);
        this.status = status;
        this.response_message = response_message;
    }

    resolve(res) {
        res.status(this.status).json({message: this.response_message});
        console.log(this.message);
    }
}

export class NotFoundError extends HTTPError {
    constructor(id) {
        super(404, `User ${id} Not Found`);
    }
}

// Unused here
export class InternalError extends HTTPError {
    constructor(message=null) {
        super(500, "Internal Server Error", message);
    }
}

export class DBError extends HTTPError {
    constructor(message=null) {
        super(500, "Internal Database Error", message);
    }
}


export function resolveError(res, err) {
    if (err instanceof HTTPError) {
        err.resolve(res);
    } else {
        (new DBError(err.message)).resolve(res);
    }
}

export function checkRequestFields(req, fields) {
    for (let field of fields) {
        if (req.body[field] === undefined) {
            throw new HTTPError(400, "Request must contain " + field + " field")
        }
    }
} 