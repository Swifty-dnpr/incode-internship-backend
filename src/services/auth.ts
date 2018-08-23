import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { Connection } from 'typeorm';

import { DatabaseProvider } from '../database/database';
import { config } from '../../config';
import { User } from '../models';
import { AuthData, InnerResponse, JWTData } from '../types';

export class AuthService {
  public async authenticate(userData: AuthData): Promise<InnerResponse> {
    console.log(`registering new user: ${userData.login}`);
    const connection: Connection = await DatabaseProvider.getConnection();

    try {
      const pwd: string = await bcrypt.hash(userData.password, 12);
      const user: User = new User();
      user.login = userData.login;
      user.password = pwd;

      const exists: User = await connection.mongoManager.findOne(User, {
        login: userData.login,
      });

      if (exists && exists.id) {
        return new InnerResponse(403, { error: 'Such user already exists, please choose an unique login' });
      }

      const result: User = await connection.mongoManager.save(User, user);

      return new InnerResponse(200, {...this.signToken(result)});
    } catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async login(userData: AuthData): Promise<InnerResponse> {
    console.log(`logging in as ${userData.login}`);

    const connection: Connection = await DatabaseProvider.getConnection();

    try {
      const user: User = await connection.mongoManager.findOne(User, {
        login: userData.login,
      });

      if (!user) {
        return new InnerResponse(404, { error: 'User not found' });
      }

      const match: User = await bcrypt.compare(userData.password, user.password);

      if (!match) {
        return new InnerResponse(403, {error: 'Passwords don\'t match'});
      }

      return new InnerResponse(200, {...this.signToken(user)});
    } catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  private signToken(user: User): JWTData {
    const token: string = jwt.sign({ ...user }, config.jwt.secret, {
      expiresIn: '45m',
    });

    const { iat, exp } = jwt.decode(token);

    return { iat, exp, token };
  }
}

export const authService: AuthService = new AuthService();
