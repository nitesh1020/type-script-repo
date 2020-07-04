import { getStatusText, BAD_REQUEST, INTERNAL_SERVER_ERROR } from "http-status-codes";
import { Response } from "express";
export class APIError extends Error {
    public code: number;
    public key: string;
    public success: boolean;
    public error: [{ key: string, message: string }];
    constructor(key: string, message: string, code: number = BAD_REQUEST) {
        super(message);
        this.code = code;
        this.key = key;
        this.message = message;
        this.success = false;
        this.error = [{ key, message }]
    }
}

export const AUTH_ERRORS = {
    emptyEmail: { key: "10001", msg: "Missing field email." },
    emptyPwd: { key: "10002", msg: "Missing field password." },
    authenticationFailed: { key: "10003", msg: "Invalid login credentials." },
    invalidPassword: { key: "10004", msg: "Invalid password." },
    invalidUser: { key: "10004", msg: "User not found." },
    notVerifiedUser: { key: "10004", msg: "User not verified." },
    invalidToken: { key: "10005", msg: "Invalid token." },
    expieredToken: { key: "10005", msg: "Expired token." },
    accquireToken: { key: "10006", msg: "You need to acquire the token to access this resource." },
    invalidResetPwdAttempt: { key: "10006", msg: "Invalid attempt to reset password." },
    exceedResetPwdAttempts: { key: "10006", msg: "Reset password attempts exceed maximum limit." },
}

export const CONNECTION_ERRORS = {
    dbConnection: { key: "20001", msg: "Connetion Error." },
    serverConnection: { key: "20002", msg: "Connetion Error." },
    request: { key: "20003", msg: "Something happened in setting up the request that triggered an Error." },
    response: { key: "20003", msg: "The request was made but no response was received." },
}

export const USERS_ERRORS = {
    missingId: { key: "30001", msg: "Missing user id." },
    missingName: { key: "30002", msg: "Missing user name." },
    invalidRole: { key: "30003", msg: "Invalid user role." },
    notVerified: { key: "30004", msg: "Please verify your account." },
    userExists: { key: "30005", msg: "Email is already registered." },
    deleted: { key: "30005", msg: "Account is deleted. Please contact bank." },
    invalid: { key: "30005", msg: "Invalid Email." },
}

export const ACCOUNTS_ERRORS = {
    missingFields: { key: "40001", msg: "Missing fields." },
    missingId: { key: "40001", msg: "Missing account id." },
    invalidType: { key: "40002", msg: "Invalid account type." },
}

export const TRANSACTIONS_ERRORS = {
    missingId: { key: "50001", msg: "Missing id." },
    invalidId: { key: "50002", msg: "Specified transaction not found." },
}


export function getErrorMessage(code: number): string {
    return getStatusText(code);
}

// process error
export function processError(res: Response, error: Error | APIError) {
    // error due to bad request
    if (error instanceof APIError) {
        return res.status(BAD_REQUEST).send(error);
    }
    // server error
    if (error instanceof Error) {
        return res.status(INTERNAL_SERVER_ERROR).send(new APIError(error.name, error.message, INTERNAL_SERVER_ERROR));
    }
    res.status(INTERNAL_SERVER_ERROR).send(new APIError(CONNECTION_ERRORS.request.key,
        CONNECTION_ERRORS.request.msg, INTERNAL_SERVER_ERROR));
}