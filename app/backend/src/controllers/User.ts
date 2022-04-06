import { Request, Response } from 'express';
import * as UserServices from '../services/User';

const loginValidation = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { status, message, data } = await UserServices.getUser({ email, password });
  if (status >= 400) {
    return res.status(status).json({ message });
  }
  return res.status(200).json(data);
};

const tokenValidation = async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  const data = await UserServices.getUserRole(token);
  return res.status(200).json(data);
};

export default { loginValidation, tokenValidation };
