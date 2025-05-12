import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Travel } from './travel.entity';

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       required:
 *         - travel_id
 *         - image_url
 *       properties:
 *         image_id:
 *           type: integer
 *           description: 图片ID
 *         travel_id:
 *           type: integer
 *           description: 关联的游记ID
 *         image_url:
 *           type: string
 *           description: 图片URL
 *         image_order:
 *           type: integer
 *           description: 图片排序顺序
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 */
@Entity('images')
export class Image {
  @PrimaryGeneratedColumn({ name: 'image_id' })
  id: number;

  @Column({ name: 'travel_id' })
  travelId: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'image_order', default: 0 })
  imageOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Travel, travel => travel.images)
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;
}
