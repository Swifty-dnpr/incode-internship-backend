import { createConnection, Connection } from 'typeorm';
import * as config from '../../ormconfig.json';
import { Product, Category } from '../models';

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
    DatabaseProvider.configuration = config;
  }

  public static async getConnection(): Promise<Connection> {

    if (DatabaseProvider.connection) {
      return DatabaseProvider.connection;
    }

   DatabaseProvider.connection = await createConnection({
     type: config.type,
     host: config.host,
     port: config.port,
     database: config.database,
     entities: [Product, Category]
   });

   return DatabaseProvider.connection;
  }
}