import { Request, Response } from 'express';
import * as UserService from '../services/User';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { status, message, data } = await UserService.getUser({ email, password });
  if (status >= 400) {
    return res.status(status).json({ message });
  }
  return res.status(200).json(data);
};

const validate = async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const data = await UserService.getRole(token);
  return res.status(200).json(data);
};

export { login, validate };
