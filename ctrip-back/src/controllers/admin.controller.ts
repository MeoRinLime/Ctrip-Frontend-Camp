import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { AppError } from '../middlewares/error-handler';

export class AdminController {
  private adminService = new AdminService();

  // 管理员登录
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;

      // 表单验证
      if (!username || !password) {
        throw new AppError('用户名和密码不能为空', 400);
      }

      // 登录并获取令牌
      const result = await this.adminService.login(username, password);

      res.json({
        success: true,
        data: {
          admin: {
            id: result.admin.id,
            username: result.admin.username,
            role: result.admin.role,
          },
          token: result.token,
        },
        message: '登录成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 获取游记列表（管理员视角）
  getTravelList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, size, status, search } = req.query;
      
      const result = await this.adminService.getTravelList(
        page as string,
        size as string,
        status as 'pending' | 'approved' | 'rejected',
        search as string
      );

      res.json({
        success: true,
        data: {
          travels: result.travels,
          total: result.total,
          currentPage: page ? parseInt(page as string, 10) : 1,
          pageSize: size ? parseInt(size as string, 10) : 10,
        },
        message: '获取游记列表成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 获取游记详情（管理员视角）
  getTravelDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const travel = await this.adminService.getTravelDetail(parseInt(id, 10));

      res.json({
        success: true,
        data: travel,
        message: '获取游记详情成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 审核游记
  auditTravel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const { id } = req.params;
      const { action, reason } = req.body;

      // 验证操作类型
      if (!['approve', 'reject', 'delete'].includes(action)) {
        throw new AppError('无效的操作类型', 400);
      }

      // 拒绝操作需要提供原因
      if (action === 'reject' && !reason) {
        throw new AppError('拒绝操作需要提供原因', 400);
      }

      // 执行审核
      const travel = await this.adminService.auditTravel(
        (req.user as any).id,
        parseInt(id, 10),
        action as 'approve' | 'reject' | 'delete',
        reason
      );

      res.json({
        success: true,
        data: travel,
        message: '审核操作成功',
      });
    } catch (error) {
      next(error);
    }
  };
}
