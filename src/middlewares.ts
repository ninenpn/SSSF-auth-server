import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from 'express';

import CustomError from './classes/CustomError';
import {ErrorResponse} from './types/MessageTypes';
import {validationResult} from 'express-validator';
import {UserWithoutPassword} from './types/DBTypes';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // console.log(err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const validationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('validation errors:', messages);
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(new CustomError('No auth header provided', 401));
      return;
    }
    // we are using a bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }

    const tokenContent = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as UserWithoutPassword;
    // optionally check if the user is still in the database

    res.locals.user = tokenContent;

    next();
  } catch (error) {
    next(new CustomError('Not authorized', 401));
  }
};

export {notFound, errorHandler, validationErrors, authenticate};
