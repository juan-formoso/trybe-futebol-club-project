import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

const verifyJWT = (token: string) => {
  const privateKey = fs.readFileSync('jwt.evaluation.key', 'utf8').trim();
  const decoded = jwt.verify(token, privateKey);
  return decoded;
}

export default verifyJWT;
