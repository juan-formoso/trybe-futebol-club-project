import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import * as fs from 'fs';

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  const privateKey = fs.readFileSync('jwt.evaluation.key', 'utf8').trim();

  if (!token) {
    return res.status(401).json({
      message: 'No token provided.'
    });
  }
  try {
    const decoded = verify(token, privateKey);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token.'
    });
  }
};

export default checkToken;
