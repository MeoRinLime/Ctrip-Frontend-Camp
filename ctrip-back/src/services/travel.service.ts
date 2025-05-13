import { AppDataSource } from '../config/data-source';
import { Travel } from '../models/travel.entity';
import { Image } from '../models/image.entity';
import { Video } from '../models/video.entity';
import { User } from '../models/user.entity';
import { AppError } from '../middlewares/error-handler';
import { getPagination } from '../utils/helpers';

export class TravelService {
  private travelRepository = AppDataSource.getRepository(Travel);
  private imageRepository = AppDataSource.getRepository(Image);
  private videoRepository = AppDataSource.getRepository(Video);
  private userRepository = AppDataSource.getRepository(User);

  // 获取游记列表（已审核通过的）
  async getTravelList(page?: string, size?: string, searchTerm?: string): Promise<{ travels: Travel[]; total: number }> {
    const { limit, offset } = getPagination(page, size);

    const queryBuilder = this.travelRepository
      .createQueryBuilder('travel')
      .leftJoinAndSelect('travel.user', 'user')
      .leftJoinAndSelect('travel.images', 'images')
      .where('travel.status = :status', { status: 'approved' })
      .andWhere('travel.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('travel.createdAt', 'DESC');

    // 添加搜索条件
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

  // 获取游记详情
  async getTravelDetail(travelId: number): Promise<Travel> {
    // 查询游记详情，包括关联的用户信息、图片和视频
    const travel = await this.travelRepository.findOne({
      where: {
        id: travelId,
        status: 'approved',
        isDeleted: false,
      },
      relations: ['user', 'images', 'video'],
    });

    if (!travel) {
      throw new AppError('游记不存在或尚未通过审核', 404);
    }

    return travel;
  }

  // 获取用户的游记列表
  async getUserTravels(userId: number, page?: string, size?: string): Promise<{ travels: Travel[]; total: number }> {
    const { limit, offset } = getPagination(page, size);

    // 查询用户的游记列表
    const queryBuilder = this.travelRepository
      .createQueryBuilder('travel')
      .leftJoinAndSelect('travel.images', 'images')
      .leftJoinAndSelect('travel.video', 'video')
      .where('travel.userId = :userId', { userId })
      .andWhere('travel.isDeleted = :isDeleted', { isDeleted: false })
      .orderBy('travel.createdAt', 'DESC');

    // 获取总数
    const total = await queryBuilder.getCount();

    // 分页查询
    const travels = await queryBuilder
      .skip(offset)
      .take(limit)
      .getMany();

    return { travels, total };
  }

  // 创建游记
  async createTravel(
    userId: number,
    travelData: {
      title: string;
      content: string;
      images?: { fileUrl: string }[];
      video?: { fileUrl: string; coverUrl?: string };
    }
  ): Promise<Travel> {
    // 验证用户是否存在
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 创建游记
    const travel = new Travel();
    travel.title = travelData.title;
    travel.content = travelData.content;
    travel.userId = userId;
    travel.status = 'pending'; // 默认状态为待审核
    travel.isDeleted = false;

    // 保存游记
    const savedTravel = await this.travelRepository.save(travel);

    // 处理图片
    if (travelData.images && travelData.images.length > 0) {
      const imageEntities = travelData.images.map((img, index) => {
        const image = new Image();
        image.travelId = savedTravel.id;
        image.imageUrl = img.fileUrl;
        image.imageOrder = index;
        return image;
      });

      await this.imageRepository.save(imageEntities);
    }

    // 处理视频
    if (travelData.video) {
      const video = new Video();
      video.travelId = savedTravel.id;
      video.videoUrl = travelData.video.fileUrl;
      
      if (travelData.video.coverUrl) {
        video.videoCoverUrl = travelData.video.coverUrl;
      }

      await this.videoRepository.save(video);
    }

    // 返回完整的游记信息
    return this.getTravelById(savedTravel.id);
  }

  // 更新游记
  async updateTravel(
    userId: number,
    travelId: number,
    travelData: {
      title?: string;
      content?: string;
      images?: { fileUrl: string }[];
      video?: { fileUrl: string; coverUrl?: string };
    }
  ): Promise<Travel> {
    // 查找游记
    const travel = await this.travelRepository.findOne({
      where: {
        id: travelId,
        userId: userId,
        isDeleted: false,
      },
    });

    if (!travel) {
      throw new AppError('游记不存在或您无权操作', 404);
    }

    // 只有待审核或被拒绝的游记可以更新
    if (travel.status !== 'pending' && travel.status !== 'rejected') {
      throw new AppError('只有待审核或被拒绝的游记可以编辑', 400);
    }

    // 更新游记信息
    if (travelData.title) travel.title = travelData.title;
    if (travelData.content) travel.content = travelData.content;
    travel.status = 'pending'; // 更新后重置为待审核状态
    travel.rejectReason = null; // 清除拒绝原因

    // 保存游记
    await this.travelRepository.save(travel);

    // 处理图片（如果有新的图片，则删除所有旧图片并添加新图片）
    if (travelData.images) {
      // 删除旧图片
      await this.imageRepository.delete({ travelId: travel.id });

      // 添加新图片
      if (travelData.images.length > 0) {
        const imageEntities = travelData.images.map((img, index) => {
          const image = new Image();
          image.travelId = travel.id;
          image.imageUrl = img.fileUrl;
          image.imageOrder = index;
          return image;
        });

        await this.imageRepository.save(imageEntities);
      }
    }

    // 处理视频（如果有新的视频，则删除旧视频并添加新视频）
    if (travelData.video) {
      // 删除旧视频
      await this.videoRepository.delete({ travelId: travel.id });

      // 添加新视频
      const video = new Video();
      video.travelId = travel.id;
      video.videoUrl = travelData.video.fileUrl;
      
      if (travelData.video.coverUrl) {
        video.videoCoverUrl = travelData.video.coverUrl;
      }

      await this.videoRepository.save(video);
    }

    // 返回更新后的游记信息
    return this.getTravelById(travel.id);
  }

  // 删除游记
  async deleteTravel(userId: number, travelId: number): Promise<void> {
    // 查找游记
    const travel = await this.travelRepository.findOne({
      where: {
        id: travelId,
        userId: userId,
        isDeleted: false,
      },
    });

    if (!travel) {
      throw new AppError('游记不存在或您无权操作', 404);
    }

    // 标记为已删除
    travel.isDeleted = true;
    await this.travelRepository.save(travel);

    // 注意：这里不删除图片和视频的物理文件，仅标记游记为已删除
  }

  // 通过ID获取游记
  private async getTravelById(travelId: number): Promise<Travel> {
    const travel = await this.travelRepository.findOne({
      where: { id: travelId },
      relations: ['user', 'images', 'video'],
    });

    if (!travel) {
      throw new AppError('游记不存在', 404);
    }

    return travel;
  }
}
