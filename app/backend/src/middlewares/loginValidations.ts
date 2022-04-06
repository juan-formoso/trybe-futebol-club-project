import { Request, Response, NextFunction } from 'express';
import * as joi from 'joi';
// import * as bcryptjs from 'bcryptjs';
import ILogin from '../interfaces/Login';
// import UserModel from '../models/UserModel';

const emailSchema = joi.object({
  email: joi.string().email().required(),
});

export const emailValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email }: ILogin = req.body;
  if (!email) {
    return res.status(401).json({ message: 'All fields must be filled' });
  }
  const { error } = emailSchema.validate({ email });
  if (error) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  next();
};

const passwordSchema = joi.object({
  password: joi.string().min(7).required(),
});

export const passwordValidation = (req: Request, res: Response, next: NextFunction) => {
  const { password }: ILogin = req.body;
  if (!password) {
    return res.status(401).json({ message: 'All fields must be filled' });
  }
  const { error } = passwordSchema.validate({ password });
  if (error) {
    return res.status(401).json({ message: 'Incorrect email or password' });
  }
  next();
};
