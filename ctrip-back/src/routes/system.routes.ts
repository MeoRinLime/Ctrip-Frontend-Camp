import { Router } from 'express';
import { validateStoragePath } from '../utils/helpers';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /api/system/health:
 *   get:
 *     summary: 系统健康检查
 *     description: 检查系统是否正常运行
 *     tags: [System]
 *     responses:
 *       200:
 *         description: 系统正常运行
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

/**
 * @swagger
 * /api/system/storage:
 *   get:
 *     summary: 存储路径检查
 *     description: 检查文件存储路径是否存在并可写
 *     tags: [System]
 *     responses:
 *       200:
 *         description: 存储路径信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 details:
 *                   type: object
 */
router.get('/storage', (req, res) => {
  const storageCheck = validateStoragePath();
  
  // 获取更详细的信息
  const useCloudStorage = process.env.NODE_ENV === 'production' && process.env.FILE_STORAGE_PATH;
  const baseDir = useCloudStorage
    ? process.env.FILE_STORAGE_PATH as string
    : path.join(__dirname, '../../', process.env.UPLOAD_DIRECTORY || 'uploads');
  
  let details: Record<string, any> = {
    mode: useCloudStorage ? 'cloud' : 'local',
    baseDir,
    fileServerUrl: process.env.FILE_SERVER_URL
  };
  
  // 检查上传子目录
  const subdirs = ['images', 'videos', 'avatars'];
  details.subdirectories = {};
  
  subdirs.forEach(dir => {
    const dirPath = path.join(baseDir, dir);
    let status = {
      exists: false,
      writable: false,
      error: null as string | null
    };
    
    try {
      status.exists = fs.existsSync(dirPath);
      if (status.exists) {
        try {
          fs.accessSync(dirPath, fs.constants.W_OK);
          status.writable = true;
        } catch (err) {
          status.writable = false;
          status.error = "不可写";
        }
      }
    } catch (err) {
      status.error = err instanceof Error ? err.message : "未知错误";
    }
    
    details.subdirectories[dir] = status;
  });
  
  res.json({ ...storageCheck, details });
});

/**
 * @swagger
 * /api/system/test-upload:
 *   post:
 *     summary: 测试文件上传
 *     description: 创建一个小测试文件来测试文件上传功能
 *     tags: [System]
 *     responses:
 *       200:
 *         description: 测试文件创建结果
 */
router.post('/test-upload', (req, res) => {
  try {
    const useCloudStorage = process.env.NODE_ENV === 'production' && process.env.FILE_STORAGE_PATH;
    const baseDir = useCloudStorage
      ? process.env.FILE_STORAGE_PATH as string
      : path.join(__dirname, '../../', process.env.UPLOAD_DIRECTORY || 'uploads');
    
    const testDir = path.join(baseDir, 'images');
    const timestamp = new Date().getTime();
    const testFilePath = path.join(testDir, `test-file-${timestamp}.txt`);
    
    // 确保目录存在
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // 创建测试文件
    fs.writeFileSync(testFilePath, `这是一个测试文件，创建于 ${new Date().toISOString()}`);
    
    // 生成访问URL
    const fileServer = process.env.FILE_SERVER_URL || 'http://localhost:3000';
    const relativePath = path.relative(path.join(__dirname, '../../'), testFilePath);
    const fileUrl = `${fileServer}/${relativePath.replace(/\\/g, '/')}`;
    
    res.json({
      success: true,
      message: '测试文件已创建',
      filePath: testFilePath,
      fileUrl,
      timestamp
    });
  } catch (error) {
    logger.error(`测试文件创建失败: ${error instanceof Error ? error.message : '未知错误'}`);
    res.status(500).json({
      success: false,
      message: '测试文件创建失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export const systemRoutes = router;
