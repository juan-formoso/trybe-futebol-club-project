import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

const verifyJWT = (token: string): string | jwt.JwtPayload => {
  const secretKey = fs.readFileSync('jwt.evaluation.key', 'utf8').trim();
  const decoded = jwt.verify(token, secretKey);

  return decoded;
};

export default verifyJWT;
