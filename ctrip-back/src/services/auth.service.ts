import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers';
import { AppError } from '../middlewares/error-handler';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  // 用户注册
  async register(userData: {
    username: string;
    password: string;
    nickname: string;
    avatarUrl?: string;
  }): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: userData.username },
        { nickname: userData.nickname },
      ],
    });

    if (existingUser) {
      throw new AppError('用户名或昵称已被使用', 400);
    }

    // 创建新用户
    const user = new User();
    user.username = userData.username;
    user.nickname = userData.nickname;
    user.password = await hashPassword(userData.password);
    
    if (userData.avatarUrl) {
      user.avatarUrl = userData.avatarUrl;
    }

    // 保存用户到数据库
    return this.userRepository.save(user);
  }

  // 用户登录
  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { username },
    });

    // 检查用户是否存在
    if (!user) {
      throw new AppError('用户名或密码错误', 401);
    }

    // 验证密码
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('用户名或密码错误', 401);
    }

    // 生成JWT令牌
    const token = generateToken(user.id, 'user');

    return { user, token };
  }

  // 获取用户信息
  async getUserProfile(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'nickname', 'avatarUrl', 'createdAt'],
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    return user;
  }

  // 更新用户信息
  async updateUserProfile(
    userId: number,
    userData: {
      nickname?: string;
      avatarUrl?: string;
    }
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 检查昵称是否已被占用
    if (userData.nickname && userData.nickname !== user.nickname) {
      const existingNickname = await this.userRepository.findOne({
        where: { nickname: userData.nickname },
      });

      if (existingNickname) {
        throw new AppError('昵称已被占用', 400);
      }

      user.nickname = userData.nickname;
    }

    // 更新头像
    if (userData.avatarUrl) {
      user.avatarUrl = userData.avatarUrl;
    }

    // 保存更新
    return this.userRepository.save(user);
  }

  // 更改密码
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 验证旧密码
    const isPasswordValid = await comparePassword(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError('旧密码不正确', 400);
    }

    // 更新密码
    user.password = await hashPassword(newPassword);
    await this.userRepository.save(user);
  }
}
