import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'ecommerce_user',
  password: process.env.POSTGRES_PASSWORD || 'passwd',
  database: process.env.POSTGRES_NAME || 'ecommerce_db',
  entities: [
    path.join(__dirname, '../../../domain/**/entities/*.entity.{ts,js}'),
  ],
  migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
  subscribers: [path.join(__dirname, '../subscribers/*.{ts,js}')],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  migrationsRun: false,
});
