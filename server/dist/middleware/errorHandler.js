"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];
    // Handle Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                statusCode = 409;
                message = 'Unique constraint failed';
                break;
            case 'P2003':
                statusCode = 400;
                message = 'Foreign key constraint failed';
                break;
            case 'P2025':
                statusCode = 404;
                message = 'Record not found';
                break;
            default:
                message = 'Database error';
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Invalid request data';
    }
    if (err instanceof client_1.Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        message = 'Database panic error';
    }
    if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        statusCode = 500;
        message = 'Database initialization error';
    }
    if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        message = 'Unknown database error';
    }
    // Handle validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errors = Object.values(err.errors).map((e) => e.message);
        message = 'Validation failed';
    }
    res.status(statusCode).json({
        success: false,
        message,
        errors: errors.length > 0 ? errors : undefined,
    });
};
exports.default = errorHandler;
