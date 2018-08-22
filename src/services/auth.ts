import { DatabaseProvider } from '../database/database';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as config from '../../config.json';
import { User } from '../models';
import { AuthData, InnerResponse } from '../types';

export class AuthService {
  public async authenticate(userData: AuthData): Promise<InnerResponse> {
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
        return new InnerResponse(403, { error: 'such user already exists' })
      }

      const result = await connection.mongoManager.save(User, user);

      return new InnerResponse(200, {...this.signToken(result)});
    } catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async login(userData: AuthData): Promise<InnerResponse> {
    console.log(`logging in as ${userData.login}`);

    const connection = await DatabaseProvider.getConnection();

    try {
      const user = await connection.mongoManager.findOne(User, {
        login: userData.login
      });

      if (!user) {
        return new InnerResponse(404, { error: 'User not found' });
      }

      const match = await bcrypt.compare(userData.password, user.password);

      if (!match) {
        return new InnerResponse(403, {error: 'Passwords don\'t match'})
      }

      return new InnerResponse(200, {...this.signToken(user)});
    } catch (error) {
      console.log(error)
      return new InnerResponse(400, { error });
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
