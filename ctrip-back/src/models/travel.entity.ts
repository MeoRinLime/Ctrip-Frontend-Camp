import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Image } from './image.entity';
import { Video } from './video.entity';
import { Audit } from './audit.entity';

/**
 * @swagger
 * components:
 *   schemas:
 *     Travel:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         travel_id:
 *           type: integer
 *           description: 游记ID
 *         user_id:
 *           type: integer
 *           description: 作者ID
 *         title:
 *           type: string
 *           description: 游记标题
 *         content:
 *           type: string
 *           description: 游记内容
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: 审核状态
 *         reject_reason:
 *           type: string
 *           description: 拒绝原因
 *         is_deleted:
 *           type: boolean
 *           description: 是否已删除
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */
@Entity('travels')
export class Travel {
  @PrimaryGeneratedColumn({ name: 'travel_id' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ name: 'reject_reason', type: 'text', nullable: true })
  rejectReason: string | null;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.travels)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Image, image => image.travel)
  images: Image[];

  @OneToOne(() => Video, video => video.travel)
  video: Video;

  @OneToMany(() => Audit, audit => audit.travel)
  audits: Audit[];
}
