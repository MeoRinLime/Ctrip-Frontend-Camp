import { AppDataSource } from '../config/data-source';
import { Admin } from '../models/admin.entity';
import { Travel } from '../models/travel.entity';
import { Audit } from '../models/audit.entity';
import { AppError } from '../middlewares/error-handler';
import { comparePassword, generateToken, getPagination } from '../utils/helpers';

export class AdminService {
  private adminRepository = AppDataSource.getRepository(Admin);
  private travelRepository = AppDataSource.getRepository(Travel);
  private auditRepository = AppDataSource.getRepository(Audit);

  // 管理员登录
  async login(username: string, password: string): Promise<{ admin: Admin; token: string }> {
    // 查找管理员
    const admin = await this.adminRepository.findOne({
      where: { username },
    });

    // 检查管理员是否存在
    if (!admin) {
      throw new AppError('用户名或密码错误', 401);
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError('用户名或密码错误', 401);
    }

    // 生成JWT令牌
    const token = generateToken(admin.id, 'admin');

    return { admin, token };
  }

  // 获取游记列表（管理员视角，包括所有状态）
  async getTravelList(
    page?: string,
    size?: string,
    status?: 'pending' | 'approved' | 'rejected',
    searchTerm?: string
  ): Promise<{ travels: Travel[]; total: number }> {
    const { limit, offset } = getPagination(page, size);

    const queryBuilder = this.travelRepository
      .createQueryBuilder('travel')
      .leftJoinAndSelect('travel.user', 'user')
      .leftJoinAndSelect('travel.images', 'images')
      .leftJoinAndSelect('travel.video', 'video')
      .where('travel.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('travel.createdAt', 'DESC');

    // 按状态过滤
    if (status) {
      queryBuilder.andWhere('travel.status = :status', { status });
    }

    // 按标题或作者搜索
    if (searchTerm) {
      queryBuilder.andWhere(
        '(travel.title LIKE :searchTerm OR user.nickname LIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      );
    }

    // 获取总数
    const total = await queryBuilder.getCount();

    // 分页查询
    const travels = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    return { travels, total };
  }

  // 获取游记详情（管理员视角，包括所有状态）
  async getTravelDetail(travelId: number): Promise<Travel> {
    // 查询游记详情，包括关联的用户信息、图片和视频
    const travel = await this.travelRepository.findOne({
      where: {
        id: travelId,
        isDeleted: false,
      },
      relations: ['user', 'images', 'video', 'audits', 'audits.admin'],
    });

    if (!travel) {
      throw new AppError('游记不存在', 404);
    }

    return travel;
  }

  // 审核游记
  async auditTravel(
    adminId: number,
    travelId: number,
    action: 'approve' | 'reject' | 'delete',
    reason?: string
  ): Promise<Travel> {
    // 查找管理员
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new AppError('管理员不存在', 404);
    }

    // 验证权限
    if (action === 'delete' && admin.role !== 'admin') {
      throw new AppError('您没有删除权限', 403);
    }

    // 查找游记
    const travel = await this.travelRepository.findOne({
      where: {
        id: travelId,
        isDeleted: false,
      },
    });

    if (!travel) {
      throw new AppError('游记不存在', 404);
    }

    // 处理审核操作
    switch (action) {
      case 'approve':
        travel.status = 'approved';
        travel.rejectReason = null;
        break;
      case 'reject':
        if (!reason) {
          throw new AppError('拒绝操作需要提供原因', 400);
        }
        travel.status = 'rejected';
        travel.rejectReason = reason;
        break;
      case 'delete':
        travel.isDeleted = true;
        break;
    }

    // 保存游记状态
    await this.travelRepository.save(travel);

    // 记录审核操作
    const audit = new Audit();
    audit.travelId = travelId;
    audit.adminId = adminId;
    audit.action = action;
    audit.reason = reason || null;
    await this.auditRepository.save(audit);

    // 返回更新后的游记信息
    return this.getTravelDetail(travelId);
  }
}
