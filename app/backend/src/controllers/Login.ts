import { Request, Response } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import ILogin from '../interfaces/Login';
import IUser from '../interfaces/User';
import UserModel from '../database/models/User';

const JWT_SECRET = fs.readFileSync('./jwt.evaluation.key', 'utf-8');

const loginController = async (req: Request, res: Response) => {
  const { email }: ILogin = req.body;
  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { id, username, role } = user as IUser;
  const token = jwt.sign({ username, role }, JWT_SECRET, { algorithm: 'HS256' });
  res.status(200).json({ user: { id, username, role, email }, token });
};

const loginAuth = async (req:Request, res: Response) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(404).json({ message: 'Token not found' });
  }
  const verified = jwt.verify(authorization, JWT_SECRET);
  const { role } = verified as jwt.JwtPayload;
  res.status(200).json(role);
};

export default { loginController, loginAuth };
