import { Express } from 'express';
import authRoutes from './auth.routes';
import travelRoutes from './travel.routes';
import adminRoutes from './admin.routes';
import { systemRoutes } from './system.routes';
import { logger } from '../utils/logger';

export const setupRoutes = (app: Express): void => {
  app.use('/api/auth', authRoutes);
  app.use('/api/travels', travelRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/system', systemRoutes);
  
  logger.info('所有路由已设置完毕');
  
  // 健康检查端点
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  });
  
  // 回退路由，处理未知请求
  app.use((req, res) => {
    res.status(404).json({ 
      success: false,
      message: '未找到请求的资源'
    });
  });
};
