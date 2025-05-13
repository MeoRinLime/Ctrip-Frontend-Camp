import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AppError } from '../middlewares/error-handler';

export class AuthController {
  private authService = new AuthService();

  // 用户注册
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password, nickname } = req.body;
      
      // 表单验证
      if (!username || !password || !nickname) {
        throw new AppError('用户名、密码和昵称不能为空', 400);
      }

      // 获取头像URL（如果有上传的话）
      let avatarUrl;
      if (req.file && 'fileUrl' in req.file) {
        avatarUrl = (req.file as Express.Multer.File & { fileUrl: string }).fileUrl;
      }

      // 创建用户
      const user = await this.authService.register({
        username,
        password,
        nickname,
        avatarUrl,
      });

      // 生成JWT令牌
      const token = await this.authService.login(username, password);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
          },
          token: token.token,
        },
        message: '注册成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 用户登录
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username, password } = req.body;

      // 表单验证
      if (!username || !password) {
        throw new AppError('用户名和密码不能为空', 400);
      }

      // 登录并获取令牌
      const result = await this.authService.login(username, password);

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            username: result.user.username,
            nickname: result.user.nickname,
            avatarUrl: result.user.avatarUrl,
          },
          token: result.token,
        },
        message: '登录成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 获取当前用户信息
  getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const user = await this.authService.getUserProfile((req.user as any).id);

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // 更新用户资料
  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const { nickname } = req.body;
      
      // 获取头像URL（如果有上传的话）
      let avatarUrl;
      if (req.file && 'fileUrl' in req.file) {
        avatarUrl = (req.file as Express.Multer.File & { fileUrl: string }).fileUrl;
      }

      const updatedUser = await this.authService.updateUserProfile((req.user as any).id, {
        nickname,
        avatarUrl,
      });

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          username: updatedUser.username,
          nickname: updatedUser.nickname,
          avatarUrl: updatedUser.avatarUrl,
        },
        message: '个人资料更新成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 修改密码
  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const { oldPassword, newPassword } = req.body;

      // 表单验证
      if (!oldPassword || !newPassword) {
        throw new AppError('旧密码和新密码不能为空', 400);
      }

      await this.authService.changePassword((req.user as any).id, oldPassword, newPassword);

      res.json({
        success: true,
        message: '密码修改成功',
      });
    } catch (error) {
      next(error);
    }
  };
}
