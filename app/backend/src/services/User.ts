import * as fs from 'fs';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Users from '../database/models/User';
import verifyJWT from '../middlewares/Auth';

type UserLogin = { email: string, password: string };

const getUser = async ({ email, password }: UserLogin) => {
  const user = await Users.findOne({ where: { email } });
  if (!user) { return { status: 401, message: 'Incorrect email or password' }; }
  const verifyCrypt = await bcryptjs.compare(password, user.password);
  if (!verifyCrypt) { return { status: 401, message: 'Incorrect email or password' }; }
  const secretKey = fs.readFileSync('jwt.evaluation.key', 'utf8').trim();
  const token = jwt.sign({ email }, secretKey);
  const loginResponse = {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    },
    token,
  };
  return { status: 200, data: loginResponse };
};

const getRole = async (token: string) => {
  const decoded = verifyJWT(token);
  if (typeof decoded === 'object') {
    const user = await Users.findOne({ where: { email: decoded.email } });
    return user?.role;
  }
};

export { getUser, getRole };
