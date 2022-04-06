import ILogin from './Login';

interface IUser extends ILogin {
  id: number;
  username: string;
  role: string;
}

export default IUser;
