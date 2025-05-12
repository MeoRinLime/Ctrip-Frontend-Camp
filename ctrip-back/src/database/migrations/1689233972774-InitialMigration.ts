import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1689233972774 implements MigrationInterface {
    name = 'InitialMigration1689233972774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
                username VARCHAR(50) NOT NULL COMMENT '用户名',
                password VARCHAR(255) NOT NULL COMMENT '密码（应加密存储）',
                nickname VARCHAR(50) NOT NULL COMMENT '昵称',
                avatar_url VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                PRIMARY KEY (user_id),
                UNIQUE KEY idx_username (username),
                UNIQUE KEY idx_nickname (nickname)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表'
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS travels (
                travel_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '游记ID',
                user_id BIGINT NOT NULL COMMENT '作者ID',
                title VARCHAR(100) NOT NULL COMMENT '游记标题',
                content TEXT NOT NULL COMMENT '游记内容',
                status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '审核状态：待审核、已通过、未通过',
                reject_reason TEXT DEFAULT NULL COMMENT '拒绝原因',
                is_deleted TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                PRIMARY KEY (travel_id),
                KEY idx_user_id (user_id),
                KEY idx_status (status),
                KEY idx_title (title),
                KEY idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游记表'
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS images (
                image_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '图片ID',
                travel_id BIGINT NOT NULL COMMENT '关联的游记ID',
                image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
                image_order INT NOT NULL DEFAULT 0 COMMENT '图片排序（用于控制显示顺序）',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                PRIMARY KEY (image_id),
                KEY idx_travel_id (travel_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游记图片表'
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS videos (
                video_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '视频ID',
                travel_id BIGINT NOT NULL COMMENT '关联的游记ID',
                video_url VARCHAR(255) NOT NULL COMMENT '视频URL',
                video_cover_url VARCHAR(255) DEFAULT NULL COMMENT '视频封面URL',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                PRIMARY KEY (video_id),
                UNIQUE KEY idx_travel_id (travel_id) COMMENT '一篇游记只允许一个视频'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='游记视频表'
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS admins (
                admin_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
                username VARCHAR(50) NOT NULL COMMENT '用户名',
                password VARCHAR(255) NOT NULL COMMENT '密码（应加密存储）',
                role ENUM('auditor', 'admin') NOT NULL DEFAULT 'auditor' COMMENT '角色：审核人员、管理员',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                PRIMARY KEY (admin_id),
                UNIQUE KEY idx_username (username)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表'
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS audits (
                audit_id BIGINT NOT NULL AUTO_INCREMENT COMMENT '审核记录ID',
                travel_id BIGINT NOT NULL COMMENT '游记ID',
                admin_id BIGINT NOT NULL COMMENT '审核人员ID',
                action ENUM('approve', 'reject', 'delete') NOT NULL COMMENT '审核操作：通过、拒绝、删除',
                reason TEXT DEFAULT NULL COMMENT '操作原因（如拒绝原因）',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '审核时间',
                PRIMARY KEY (audit_id),
                KEY idx_travel_id (travel_id),
                KEY idx_admin_id (admin_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审核记录表'
        `);

        await queryRunner.query(`
            ALTER TABLE travels
                ADD CONSTRAINT fk_travels_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE images
                ADD CONSTRAINT fk_images_travel_id FOREIGN KEY (travel_id) REFERENCES travels (travel_id) ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE videos
                ADD CONSTRAINT fk_videos_travel_id FOREIGN KEY (travel_id) REFERENCES travels (travel_id) ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE audits
                ADD CONSTRAINT fk_audits_travel_id FOREIGN KEY (travel_id) REFERENCES travels (travel_id) ON DELETE CASCADE,
                ADD CONSTRAINT fk_audits_admin_id FOREIGN KEY (admin_id) REFERENCES admins (admin_id)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE audits DROP FOREIGN KEY fk_audits_admin_id`);
        await queryRunner.query(`ALTER TABLE audits DROP FOREIGN KEY fk_audits_travel_id`);
        await queryRunner.query(`ALTER TABLE videos DROP FOREIGN KEY fk_videos_travel_id`);
        await queryRunner.query(`ALTER TABLE images DROP FOREIGN KEY fk_images_travel_id`);
        await queryRunner.query(`ALTER TABLE travels DROP FOREIGN KEY fk_travels_user_id`);
        
        await queryRunner.query(`DROP TABLE IF EXISTS audits`);
        await queryRunner.query(`DROP TABLE IF EXISTS videos`);
        await queryRunner.query(`DROP TABLE IF EXISTS images`);
        await queryRunner.query(`DROP TABLE IF EXISTS travels`);
        await queryRunner.query(`DROP TABLE IF EXISTS admins`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
    }
}
