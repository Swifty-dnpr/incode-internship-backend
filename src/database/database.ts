import { createConnection, Connection } from 'typeorm';
import * as app_config from '../../ormconfig.json';
import { Product, Category, User } from '../models';

export interface DatabaseConfiguration {
  type: string;
  host: string;
  port: number;
  database: string;
}

export class DatabaseProvider {
  private static connection: Connection;
  private static configuration: DatabaseConfiguration;

  public static configure(config: DatabaseConfiguration): void {
    DatabaseProvider.configuration = app_config;
  }

  public static async getConnection(): Promise<Connection> {

    if (DatabaseProvider.connection) {
      return DatabaseProvider.connection;
    }

    DatabaseProvider.connection = await createConnection({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'ng-commerce',
      entities: [Category, User, Product],
      logging: false,
      synchronize: true,
    });

    return DatabaseProvider.connection;
  }
}
