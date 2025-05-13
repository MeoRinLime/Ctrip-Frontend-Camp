import { RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from './error-handler';

import { logger } from '../utils/logger';

// 确保上传目录存在
const createUploadDirs = (): void => {
  // 始终使用云服务器路径
  const storagePath = process.env.FILE_STORAGE_PATH || '/var/www/uploads';
  const dirs = ['images', 'videos', 'avatars'];
  
  try {
    dirs.forEach(dir => {
      // 云服务器存储路径
      const fullPath = path.join(storagePath, dir);
      
      // 创建目录（如果不存在）
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        logger.info(`Created cloud upload directory: ${fullPath}`);
      }
    });
    
    logger.info(`File storage configured: Cloud server storage at ${storagePath}`);
  } catch (error) {
    logger.error(`Error creating upload directories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('无法创建云服务器上传目录，请检查文件系统权限');
  }
};

// 创建上传目录
createUploadDirs();

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadType = 'images';
    
    if (file.mimetype.startsWith('video/')) {
      uploadType = 'videos';
    } else if (file.fieldname === 'avatar') {
      uploadType = 'avatars';
    }
    
    // 始终使用云服务器路径
    const storagePath = process.env.FILE_STORAGE_PATH || '/var/www/uploads';
    const uploadPath = path.join(storagePath, uploadType);
    
    logger.debug(`File upload destination: ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名，添加时间戳以确保唯一性
    const timestamp = new Date().getTime();
    const uniqueFilename = `${uuidv4()}_${timestamp}${path.extname(file.originalname)}`;
    logger.debug(`Generated filename for upload: ${uniqueFilename}`);
    cb(null, uniqueFilename);
  }
});

// 过滤文件类型
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  // 允许的图片类型
  const allowedImageTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  // 允许的视频类型
  const allowedVideoTypes: string[] = ['video/mp4', 'video/webm', 'video/ogg'];
  
  // 检查文件类型
  if (file.fieldname === 'images' && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (file.fieldname === 'avatar' && allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn(`Rejected file upload: ${file.originalname}, mimetype: ${file.mimetype}, fieldname: ${file.fieldname}`);
    cb(new Error('不支持的文件类型'));
  }
};

// 创建multer实例
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 默认10MB
  }
});

// 处理多张图片上传的中间件
export const uploadImages: RequestHandler = (req, res, next) => {
  const uploadMiddleware = upload.array('images', 10); // 最多10张图片
  
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        next(new AppError('文件太大', 400));
      } else {
        next(new AppError(`上传错误: ${err.message}`, 400));
      }
    } else if (err) {
      next(new AppError(err.message, 400));    } else {      // 处理上传的文件路径
      if (req.files && Array.isArray(req.files)) {
        const fileServer = process.env.FILE_SERVER_URL || 'http://47.120.46.215:3000';
        
        // 为每个文件添加可访问的URL
        req.files.forEach((file: Express.Multer.File & { fileUrl?: string }) => {
          // 从文件路径中提取文件夹和文件名
          const fileName = path.basename(file.path);
          const dirName = path.basename(path.dirname(file.path));
          
          // 生成完整URL
          file.fileUrl = `${fileServer}/uploads/${dirName}/${fileName}`;
          logger.debug(`File uploaded to cloud: ${file.originalname}, accessible at: ${file.fileUrl}`);
        });
      }
      next();
    }
  });
};

// 处理单个视频上传的中间件
export const uploadVideo: RequestHandler = (req, res, next) => {
  const uploadMiddleware = upload.single('video');
  
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        logger.error(`Video upload failed - File too large: ${err.message}`);
        next(new AppError('文件太大，视频大小不能超过限制', 400));
      } else {
        logger.error(`Video upload multer error: ${err.message}`);
        next(new AppError(`上传错误: ${err.message}`, 400));
      }
    } else if (err) {
      logger.error(`Video upload error: ${err.message}`);
      next(new AppError(err.message, 400));    } else {
      // 处理上传的文件路径
      if (req.file) {
        const fileServer = process.env.FILE_SERVER_URL || 'http://47.120.46.215:3000';
        
        // 从文件路径中提取文件夹和文件名
        const fileName = path.basename(req.file.path);
        const dirName = path.basename(path.dirname(req.file.path));
        
        // 生成完整URL
        (req.file as Express.Multer.File & { fileUrl: string }).fileUrl = `${fileServer}/uploads/${dirName}/${fileName}`;
        logger.debug(`Video uploaded to cloud: ${req.file.originalname}, accessible at: ${(req.file as Express.Multer.File & { fileUrl: string }).fileUrl}`);
      }
      next();
    }
  });
};

// 处理头像上传的中间件
export const uploadAvatar: RequestHandler = (req, res, next) => {
  const uploadMiddleware = upload.single('avatar');
  
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        logger.error(`Avatar upload failed - File too large: ${err.message}`);
        next(new AppError('头像文件太大', 400));
      } else {
        logger.error(`Avatar upload multer error: ${err.message}`);
        next(new AppError(`头像上传错误: ${err.message}`, 400));
      }
    } else if (err) {
      logger.error(`Avatar upload error: ${err.message}`);
      next(new AppError(err.message, 400));    } else {
      // 处理上传的文件路径
      if (req.file) {
        const fileServer = process.env.FILE_SERVER_URL || 'http://47.120.46.215:3000';
        
        // 从文件路径中提取文件夹和文件名
        const fileName = path.basename(req.file.path);
        const dirName = path.basename(path.dirname(req.file.path));
        
        // 生成完整URL
        (req.file as Express.Multer.File & { fileUrl: string }).fileUrl = `${fileServer}/uploads/${dirName}/${fileName}`;
        logger.debug(`Avatar uploaded to cloud: ${req.file.originalname}, accessible at: ${(req.file as Express.Multer.File & { fileUrl: string }).fileUrl}`);
      }
      next();
    }
  });
};
