import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import { Admin } from '../models/admin.entity';

// 扩展 Express 的 Request 接口，添加 user 属性
declare global {
  namespace Express {
    interface Request {
      user?: User | Admin;
      userType?: 'user' | 'admin';
    }
  }
}

// 用户认证中间件
export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: '未提供访问令牌' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { id: number; type: 'user' | 'admin' };

    if (decoded.type === 'user') {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { id: decoded.id } });

      if (!user) {
        res.status(401).json({ message: '用户不存在' });
        return;
      }

      req.user = user;
      req.userType = 'user';
    }

    next();
  } catch (error) {
    res.status(401).json({ message: '无效的访问令牌' });
  }
};

// 管理员认证中间件
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: '未提供访问令牌' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { id: number; type: 'user' | 'admin' };

    if (decoded.type !== 'admin') {
      res.status(403).json({ message: '需要管理员权限' });
      return;
    }

    const adminRepository = AppDataSource.getRepository(Admin);
    const admin = await adminRepository.findOne({ where: { id: decoded.id } });

    if (!admin) {
      res.status(401).json({ message: '管理员不存在' });
      return;
    }

    req.user = admin;
    req.userType = 'admin';
    next();
  } catch (error) {
    res.status(401).json({ message: '无效的访问令牌' });
  }
};

// 角色检查中间件
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || req.userType !== 'admin') {
      res.status(403).json({ message: '需要管理员权限' });
      return;
    }

    const admin = req.user as Admin;
    if (roles.includes(admin.role)) {
      next();
    } else {
      res.status(403).json({ message: '权限不足' });
    }
  };
};
