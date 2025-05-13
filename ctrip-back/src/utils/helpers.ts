import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { logger } from './logger';

// 生成JWT令牌
export const generateToken = (id: number, type: 'user' | 'admin'): string => {
  const payload = { id, type };
  const secret = process.env.JWT_SECRET || 'default_secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(payload, secret, { expiresIn });
};

// 密码加密
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 密码比对
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// 分页辅助函数
export const getPagination = (page?: string, size?: string): { limit: number; offset: number } => {
  const limit = size ? +size : 10;
  const offset = page ? (+page - 1) * limit : 0;
  
  return { limit, offset };
};

// 定义数据库错误类型
interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlMessage?: string;
  sqlState?: string;
}

// 处理数据库异常
export const handleDBError = (error: Error | DatabaseError | unknown): { message: string; status: number } => {
  // 检查是否是数据库错误
  if (error && typeof error === 'object' && 'code' in error) {
    const dbError = error as DatabaseError;
    
    if (dbError.code === 'ER_DUP_ENTRY') {
      return {
        message: '数据已存在',
        status: 400,
      };
    }
    
    // 记录详细的数据库错误信息
    logger.error(`数据库错误: ${dbError.code}, ${dbError.sqlMessage || dbError.message}`);
  }
  
  return {
    message: '数据库操作失败',
    status: 500,
  };
};

// 验证文件存储路径
export const validateStoragePath = (): { isValid: boolean; message: string } => {
  try {
    const useCloudStorage = process.env.FILE_STORAGE_PATH;
    const storagePath = useCloudStorage
      ? process.env.FILE_STORAGE_PATH
      : path.join(__dirname, '../../', process.env.UPLOAD_DIRECTORY || 'uploads');
    
    if (!storagePath) {
      return { isValid: false, message: '未配置存储路径' };
    }
    
    // 检查路径是否存在及是否可写
    if (!fs.existsSync(storagePath)) {
      return { isValid: false, message: `存储路径不存在: ${storagePath}` };
    }
    
    try {
      fs.accessSync(storagePath, fs.constants.W_OK);
      return { isValid: true, message: `存储路径有效且可写: ${storagePath}` };
    } catch (error) {
      return { isValid: false, message: `存储路径不可写: ${storagePath}` };
    }
  } catch (error) {
    return { isValid: false, message: `验证存储路径时出错: ${error instanceof Error ? error.message : '未知错误'}` };
  }
};

// 获取文件URL
export const getFileUrl = (filePath: string): string => {
  const fileServer = process.env.FILE_SERVER_URL || 'http://localhost:3000';
  
  // 将Windows路径分隔符替换为URL路径分隔符
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  // 移除开头的 /uploads 以避免重复
  const cleanPath = normalizedPath.startsWith('/uploads') 
    ? normalizedPath
    : `/uploads/${normalizedPath.split('/uploads/')[1] || normalizedPath}`;
  
  return `${fileServer}${cleanPath}`;
};

// 测试文件是否可访问
export const testFileAccessibility = async (url: string): Promise<{ accessible: boolean; message: string }> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      return { accessible: true, message: `文件可访问: ${url}` };
    } else {
      return { accessible: false, message: `文件无法访问，状态码: ${response.status}, URL: ${url}` };
    }
  } catch (error) {
    return { accessible: false, message: `测试文件访问时出错: ${error instanceof Error ? error.message : '未知错误'}, URL: ${url}` };
  }
};
