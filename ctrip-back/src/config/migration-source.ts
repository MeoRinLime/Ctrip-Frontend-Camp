import { DataSource } from "typeorm";

// 导入实体
import { User } from '../models/user.entity';
import { Travel } from '../models/travel.entity';
import { Image } from '../models/image.entity';
import { Video } from '../models/video.entity';
import { Audit } from '../models/audit.entity';
import { Admin } from '../models/admin.entity';

// 创建数据源
const AppDataSource = new DataSource({
  type: "mysql",
  host: "47.120.46.215",
  port: 3306,
  username: "lime",
  password: "KizunaAi.0630",
  database: "ctrip_travel_diary",
  synchronize: false,
  entities: [User, Travel, Image, Video, Audit, Admin],
  migrations: ["src/database/migrations/*.ts"],
  subscribers: [],
});

// 仅导出一个实例
module.exports = AppDataSource;
