import { User } from './entities/user.entity';

export const cleanUserResult = (user: User, keepPassword: boolean = false) => {
  if (user) {
    if (!keepPassword) {
      delete user.password;
    }
    return user;
  }

  return null;
};
