import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { AppDataSource } from './config/data-source';
import { setupRoutes } from './routes';
import { errorHandler } from './middlewares/error-handler';
import { setupSwagger } from './config/swagger';
import { logger } from './utils/logger';
import path from 'path';
import { apiLimiter, requestLogger } from './middlewares/common';

// 加载环境变量
dotenv.config();

// 创建Express实例
const app = express();
const port = process.env.PORT || 3000;

// 使用中间件
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(requestLogger);

// API限速
app.use('/api/', apiLimiter);

// 静态文件目录
const uploadPath = process.env.FILE_STORAGE_PATH || path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadPath));
logger.info(`Serving static files from: ${uploadPath}`);

// 设置Swagger文档
setupSwagger(app);

// 设置路由
setupRoutes(app);

// 错误处理中间件
app.use(errorHandler);

// 导入文件存储验证函数
import { validateStoragePath } from './utils/helpers';

// 数据库连接
AppDataSource.initialize()
  .then(() => {
    logger.info('Database connection established');
    
    // 验证文件存储路径
    const storageCheck = validateStoragePath();
    if (storageCheck.isValid) {
      logger.info(`文件存储配置正确: ${storageCheck.message}`);
    } else {
      logger.warn(`文件存储配置问题: ${storageCheck.message}`);
    }
    
    // 启动服务器
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  })  .catch((error: unknown) => {
    if (error instanceof Error) {
      logger.error('Error during Data Source initialization', error);
    } else {
      logger.error('Unknown error during Data Source initialization');
    }
  });

export default app;
