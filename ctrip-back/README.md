# 旅游日记平台后端服务

这是旅游日记平台的后端服务，基于Node.js、Express、TypeScript和TypeORM开发。本文档提供了项目的安装、配置和启动说明。

## 功能特性

- 用户认证（注册/登录）
- 游记管理（创建/编辑/删除）
- 多媒体上传（图片/视频）
- 管理员审核系统
- API文档（Swagger）
- 日志系统
- 安全防护（Helmet、CORS、速率限制）

## 安装

### 前置条件

- Node.js 16+
- MySQL 8.0+
- pnpm

### 安装步骤

1. 克隆项目或解压项目文件

2. 安装依赖

```bash
cd ctrip-back
pnpm install
```

3. 配置环境变量

复制`.env.example`文件为`.env`，并根据实际情况修改配置：

```bash
cp .env.example .env
```

主要配置项：

- 数据库连接信息
- JWT密钥
- 上传文件相关配置
- 日志级别

4. 创建数据库

```sql
CREATE DATABASE ctrip_travel_diary CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 运行项目

### 开发环境

1. 运行数据库迁移

```bash
pnpm migrate
```

2. 创建初始管理员账号

```bash
pnpm seed
```

3. 启动开发服务器

```bash
pnpm dev
```

服务器默认在`http://localhost:3000`运行，API文档地址为`http://localhost:3000/api-docs`

### 生产环境

1. 构建项目

```bash
pnpm build
```

2. 运行数据库迁移

```bash
pnpm migrate
```

3. 创建初始管理员账号（如果尚未创建）

```bash
pnpm seed
```

4. 启动服务器

```bash
pnpm start
```

## API文档

启动服务器后，访问`http://localhost:3000/api-docs`查看Swagger API文档。

## 项目结构

```
src/
├── config/           # 配置文件
├── controllers/      # 控制器
├── database/         # 数据库迁移和种子
├── middlewares/      # 中间件
├── models/           # 数据模型
├── repositories/     # 数据仓库
├── routes/           # 路由定义
├── services/         # 业务逻辑服务
├── types/            # 类型定义
├── uploads/          # 上传文件目录
├── utils/            # 工具函数
└── index.ts          # 应用入口
```

## 默认账号

系统初始化后会创建两个管理员账号：

1. 管理员
   - 用户名：admin
   - 密码：admin123
   - 权限：所有操作

2. 审核员
   - 用户名：auditor
   - 密码：auditor123
   - 权限：审核游记

## 许可证

MIT
