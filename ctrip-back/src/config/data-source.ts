import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { join } from 'path';
import { User } from '../models/user.entity';
import { Travel } from '../models/travel.entity';
import { Image } from '../models/image.entity';
import { Video } from '../models/video.entity';
import { Audit } from '../models/audit.entity';
import { Admin } from '../models/admin.entity';

// 加载环境变量
dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: [User, Travel, Image, Video, Audit, Admin],
  migrations: [join(__dirname, '../database/migrations/**/*.{ts,js}')],
  subscribers: [],
  connectorPackage: 'mysql2',
  extra: {
    connectionLimit: 10
  }
});
