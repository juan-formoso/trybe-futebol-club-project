import * as fs from 'fs';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import Users from '../database/models/User';

type User = {
  email: string;
  password: string;
};

const getUser = async ({ email, password }: User) => {
  const user = await Users.findOne({ 
    where: { 
      email,
    } 
  });
  if (!user) { 
    return { status: 401, message: 'Incorrect email or password' }; 
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return { status: 401, message: 'Incorrect email or password' };
  }
  const secret: string = await fs.readFileSync('jwt.evaluation.key', 'utf8').trim();
  const token = jwt.sign({ email }, secret, { expiresIn: '1h' });
  const loginResponse = {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }
  }
  return { status: 200, message: 'Login successful', token, loginResponse };
};

export { getUser };
