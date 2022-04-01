import { Request, Response } from 'express';
import UserServices from '../services/User';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserServices.getUser({ email, password });
  if (user.status === 401) {
    return res.status(user.status).json({ message: user.message });
  }
  return res.status(200).json({ 
    message: user.message, 
    token: user.token, 
    loginResponse: user.loginResponse,
  });
};

export default { login };
