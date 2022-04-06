import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.headers.authorization;
  const secretKey = fs.readFileSync('jwt.evaluation.key', 'utf8').trim();
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }
  try {
    jwt.verify(token, secretKey);
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default checkToken;
