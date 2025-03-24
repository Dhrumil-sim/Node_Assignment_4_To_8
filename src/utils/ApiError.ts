import { StatusCodes, getReasonPhrase } from "http-status-codes";

class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];
    errorCode: string;

    constructor(
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode: string = "INTERNAL_ERROR",
        message: string = getReasonPhrase(statusCode),
        errors: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
