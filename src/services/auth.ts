import { DatabaseProvider } from '../database/database';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as config from '../../config.json';
import { User } from '../models';
import { AuthData } from '../types';

export class AuthService {
  public async authenticate(userData: AuthData): Promise<any> {
    console.log(`authenticating ${userData.login}`);
    const connection = await DatabaseProvider.getConnection();

    try {
      const pwd = await bcrypt.hash(userData.password, 12);
      const user = new User();
      user.login = userData.login;
      user.password = pwd;
      const exists = await connection.mongoManager.findOne(User, {
        login: userData.login
      });

      if (exists && exists.id) {
        return {
          status: 400,
          data: {
            success: false,
            error: 'such user already exists'
          }
        };
      }

      const result = await connection.mongoManager.save(user);

      return { status: 200, data: this.signToken(result) };
    } catch (error) {
      return { status: 400, data: { error } };
    }
  }

  public async login(userData: AuthData): Promise<any> {
    console.log(`logging in as ${userData.login}`);

    const connection = await DatabaseProvider.getConnection();

    try {
      const user = await connection.mongoManager.findOne(User, {
        login: userData.login
      });
      const match = await bcrypt.compare(userData.password, user.password);

      if (!match) {
        return {
          status: 403,
          data: {
            success: false,
            error: "Passwords don't match"
          }
        };
      }

      return { status: 200, data: this.signToken(user) };
    } catch (error) {
      return { status: 400, data: { success: false, error } };
    }
  }

  private signToken(user: User): Object {
    const token = jwt.sign({ ...user }, config.jwt.secret, {
      expiresIn: '45m'
    });

    const { iat, exp } = jwt.decode(token);
    return { iat, exp, token };
  }
}

export const authService = new AuthService();
