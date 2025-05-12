#!/usr/bin/env node

// TypeScript register
require('ts-node/register');

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
// 简易日志记录，避免依赖编译后的logger
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message, error) => console.error(`[ERROR] ${message}`, error)
};

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    });

    logger.info('Connected to MySQL server');
    
    // 检查数据库是否存在
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, 
      [process.env.DB_DATABASE]
    );

    if (rows.length === 0) {
      // 创建数据库
      await connection.execute(
        `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      logger.info(`Database ${process.env.DB_DATABASE} created successfully`);
    } else {
      logger.info(`Database ${process.env.DB_DATABASE} already exists`);
    }

    await connection.end();
    process.exit(0);
  } catch (error) {
    logger.error('Error initializing database', error);
    process.exit(1);
  }
}

// 执行函数
initializeDatabase();
