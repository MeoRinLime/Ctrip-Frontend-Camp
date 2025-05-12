import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Travel } from './travel.entity';

/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       required:
 *         - travel_id
 *         - video_url
 *       properties:
 *         video_id:
 *           type: integer
 *           description: 视频ID
 *         travel_id:
 *           type: integer
 *           description: 关联的游记ID
 *         video_url:
 *           type: string
 *           description: 视频URL
 *         video_cover_url:
 *           type: string
 *           description: 视频封面URL
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 */
@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn({ name: 'video_id' })
  id: number;

  @Column({ name: 'travel_id' })
  travelId: number;
  @Column({ name: 'video_url' })
  videoUrl: string;

  @Column({ name: 'video_cover_url', nullable: true, type: 'varchar', length: 255 })
  videoCoverUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => Travel, travel => travel.video)
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
}
