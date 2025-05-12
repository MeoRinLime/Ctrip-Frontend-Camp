import bcrypt from 'bcryptjs';
import { AppDataSource } from '../../config/data-source';
import { Admin } from '../../models/admin.entity';
import { logger } from '../../utils/logger';

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function createInitialAdmins(): Promise<void> {
  try {
    // 初始化数据库连接
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const adminRepository = AppDataSource.getRepository(Admin);

    // 检查管理员是否已存在
    const adminCount = await adminRepository.count();

    // 如果没有管理员，则创建默认管理员
    if (adminCount === 0) {
      const adminPassword = await hashPassword('admin123');
      const auditorPassword = await hashPassword('auditor123');

      const admin = new Admin();
      admin.username = 'admin';
      admin.password = adminPassword;
      admin.role = 'admin';

      const auditor = new Admin();
      auditor.username = 'auditor';
      auditor.password = auditorPassword;
      auditor.role = 'auditor';

      await adminRepository.save([admin, auditor]);

      logger.info('初始管理员账号创建成功');
    } else {
      logger.info('管理员账号已存在，跳过初始化');
    }
  } catch (error) {
    logger.error('创建初始管理员账号失败', error);
    throw error;
  }
}
