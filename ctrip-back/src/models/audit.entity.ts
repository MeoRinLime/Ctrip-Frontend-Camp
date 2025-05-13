import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Travel } from './travel.entity';
import { Admin } from './admin.entity';

/**
 * @swagger
 * components:
 *   schemas:
 *     Audit:
 *       type: object
 *       required:
 *         - travel_id
 *         - admin_id
 *         - action
 *       properties:
 *         audit_id:
 *           type: integer
 *           description: 审核记录ID
 *         travel_id:
 *           type: integer
 *           description: 游记ID
 *         admin_id:
 *           type: integer
 *           description: 审核人员ID
 *         action:
 *           type: string
 *           enum: [approve, reject, delete]
 *           description: 审核操作
 *         reason:
 *           type: string
 *           description: 操作原因
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 审核时间
 */
@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn({ name: 'audit_id' })
  id: number;

  @Column({ name: 'travel_id' })
  travelId: number;

  @Column({ name: 'admin_id' })
  adminId: number;

  @Column({
    type: 'enum',
    enum: ['approve', 'reject', 'delete'],
  })
  action: 'approve' | 'reject' | 'delete';

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Travel, travel => travel.audits)
  @JoinColumn({ name: 'travel_id' })
  travel: Travel;

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;
}
