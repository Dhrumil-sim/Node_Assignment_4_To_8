/**
 * @module Utils
 * @description Utility functions for handling async operations and common tasks.
 */

/**
 * Handles async route handlers by wrapping them in a try-catch.
 * @function asyncHandler
 * @memberof module:Utils
 * @param {Function} requestHandler - The async function to handle requests.
 * @returns {Function} Express middleware function that handles errors.
 */
const asyncHandler = (requestHandler: Function) => {
    return (req: Object, res: Object, next: any) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

export {asyncHandler};