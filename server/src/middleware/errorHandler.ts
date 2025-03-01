import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

interface CustomError extends Error {
	statusCode?: number;
	errors?: string[];
}

const errorHandler = (
	err: Error | CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let statusCode = (err as CustomError).statusCode || 500;
	let message = err.message || 'Internal Server Error';
	let errors = (err as CustomError).errors || [];

	// Handle Prisma errors
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
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

	if (err instanceof Prisma.PrismaClientValidationError) {
		statusCode = 400;
		message = 'Invalid request data';
	}

	if (err instanceof Prisma.PrismaClientRustPanicError) {
		statusCode = 500;
		message = 'Database panic error';
	}

	if (err instanceof Prisma.PrismaClientInitializationError) {
		statusCode = 500;
		message = 'Database initialization error';
	}

	if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		statusCode = 500;
		message = 'Unknown database error';
	}

	// Handle validation errors
	if (err.name === 'ValidationError') {
		statusCode = 400;
		errors = Object.values((err as any).errors).map((e: any) => e.message);
		message = 'Validation failed';
	}

	res.status(statusCode).json({
		success: false,
		message,
		errors: errors.length > 0 ? errors : undefined,
	});
};

export default errorHandler;
