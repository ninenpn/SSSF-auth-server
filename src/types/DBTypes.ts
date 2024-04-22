import {Point} from 'geojson';
import mongoose, {Document, Types} from 'mongoose';

type Cat = Partial<Document> & {
  id?: Types.ObjectId | string;
  cat_name: string;
  weight: number;
  owner: Types.ObjectId | User;
  filename: string;
  birthdate: Date;
  location: Point;
};

type User = Partial<Document> & {
  user_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

type UserWithoutPassword = Omit<User, 'password'>;

type UserWithoutPasswordRole = Omit<UserWithoutPassword, 'role'>;

export {Cat, User, UserWithoutPassword, UserWithoutPasswordRole};
