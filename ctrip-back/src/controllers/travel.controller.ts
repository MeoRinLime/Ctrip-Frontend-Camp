import { Request, Response, NextFunction } from 'express';
import { TravelService } from '../services/travel.service';
import { AppError } from '../middlewares/error-handler';

export class TravelController {
  private travelService = new TravelService();

  // 获取游记列表（首页）
  getTravelList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, size, search } = req.query;
      const result = await this.travelService.getTravelList(
        page as string,
        size as string,
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

  // 获取游记详情
  getTravelDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const travel = await this.travelService.getTravelDetail(parseInt(id, 10));

      res.json({
        success: true,
        data: travel,
        message: '获取游记详情成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 获取用户的游记列表
  getUserTravels = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const { page, size } = req.query;
      const result = await this.travelService.getUserTravels(
        (req.user as any).id,
        page as string,
        size as string
      );

      res.json({
        success: true,
        data: {
          travels: result.travels,
          total: result.total,
          currentPage: page ? parseInt(page as string, 10) : 1,
          pageSize: size ? parseInt(size as string, 10) : 10,
        },
        message: '获取个人游记列表成功',
      });
    } catch (error) {
      next(error);
    }
  };

  // 创建游记
  createTravel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const { title, content } = req.body;

      // 表单验证
      if (!title || !content) {
        throw new AppError('标题和内容不能为空', 400);
      }

      // 图片验证
      if (!req.files || !(req.files as Express.Multer.File[]).length) {
        throw new AppError('至少需要一张图片', 400);
      }

      // 处理图片
      const images = (req.files as Array<Express.Multer.File & { fileUrl: string }>).map(file => ({
        fileUrl: file.fileUrl
      }));

      // 处理视频（如果有）
      let video;
      if (req.file && 'fileUrl' in req.file) {
        video = {
          fileUrl: (req.file as Express.Multer.File & { fileUrl: string }).fileUrl,
        };
      }

      // 创建游记
      const travel = await this.travelService.createTravel((req.user as any).id, {
        title,
        content,
        images,
        video,
      });

      res.status(201).json({
        success: true,
        data: travel,
        message: '游记发布成功，等待审核',
      });
    } catch (error) {
      next(error);
    }
  };

  // 更新游记
  updateTravel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const { id } = req.params;
      const { title, content } = req.body;

      // 表单验证
      if (!title || !content) {
        throw new AppError('标题和内容不能为空', 400);
      }

      // 处理图片（如果有）
      let images;
      if (req.files && (req.files as Express.Multer.File[]).length) {
        images = (req.files as Array<Express.Multer.File & { fileUrl: string }>).map(file => ({
          fileUrl: file.fileUrl
        }));
      }

      // 处理视频（如果有）
      let video;
      if (req.file && 'fileUrl' in req.file) {
        video = {
          fileUrl: (req.file as Express.Multer.File & { fileUrl: string }).fileUrl,
        };
      }

      // 更新游记
      const travel = await this.travelService.updateTravel(
        (req.user as any).id,
        parseInt(id, 10),
        {
          title,
          content,
          images,
          video,
        }
      );

      res.json({
        success: true,
        data: travel,
        message: '游记更新成功，等待审核',
      });
    } catch (error) {
      next(error);
    }
  };

  // 删除游记
  deleteTravel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError('未授权', 401);
      }

      const { id } = req.params;
      await this.travelService.deleteTravel((req.user as any).id, parseInt(id, 10));

      res.json({
        success: true,
        message: '游记删除成功',
      });
    } catch (error) {
      next(error);
    }
  };
}
