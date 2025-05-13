import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - role
 *       properties:
 *         admin_id:
 *           type: integer
 *           description: 管理员ID
 *         username:
 *           type: string
 *           description: 用户名
 *         role:
 *           type: string
 *           enum: [auditor, admin]
 *           description: 角色
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */
@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn({ name: 'admin_id' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['auditor', 'admin'],
    default: 'auditor'
  })
  role: 'auditor' | 'admin';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
