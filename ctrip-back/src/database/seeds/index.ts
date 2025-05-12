import { createInitialAdmins } from './admin.seed';
import { logger } from '../../utils/logger';

async function runSeeds(): Promise<void> {
  try {
    // 运行所有种子
    await createInitialAdmins();

    logger.info('所有数据库种子运行成功');
    process.exit(0);
  } catch (error) {
    logger.error('数据库种子运行失败', error);
    process.exit(1);
  }
}

// 直接执行
runSeeds();
