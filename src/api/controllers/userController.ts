// Description: This file contains the functions for the user routes
// TODO: add function check, to check if the server is alive
// TODO: add function to get all users
// TODO: add function to get a user by id
// TODO: add function to create a user
// TODO: add function to update a user
// TODO: add function to delete a user
// TODO: add function to check if a token is valid
import {Request, Response, NextFunction} from 'express';
import {User} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcrypt';

const userListGet = async (
  req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  try {
    const users = await userModel.find().select('-password -__v -role');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<User>,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const userPost = async (
  req: Request<{}, {}, Omit<User, 'user_id'>>,
  res: Response<MessageResponse & {data: User}>,
  next: NextFunction
) => {
  try {
    req.body.role = 'user';
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const user = await userModel.create(req.body);
    const response = {
      message: 'User added',
      data: user,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userPut = async (
  req: Request<{id: string}, {}, Omit<User, 'user_id'>>,
  res: Response<MessageResponse & {data: User}>,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    const response = {
      message: 'User updated',
      data: user,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userPutCurrent = async (
  req: Request<{}, {}, Omit<User, 'user_id'>>,
  res: Response<MessageResponse & {data: User}>,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findByIdAndUpdate(res.locals.user._id, req.body, {
        new: true,
      })
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    const response = {
      message: 'User updated',
      data: user,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findByIdAndDelete(req.params.id)
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    res.json({message: 'User deleted'});
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findByIdAndDelete(res.locals.user._id)
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    res.json({message: 'User deleted'});
  } catch (error) {
    next(error);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPut,
  userDelete,
  userPutCurrent,
  userDeleteCurrent,
};
