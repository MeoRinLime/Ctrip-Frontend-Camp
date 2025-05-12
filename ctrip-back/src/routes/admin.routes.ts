import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateAdmin, checkRole } from '../middlewares/auth';

const router = Router();
const adminController = new AdminController();

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: 管理员登录
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功
 *       401:
 *         description: 登录失败
 */
router.post('/login', adminController.login);

/**
 * @swagger
 * /api/admin/travels:
 *   get:
 *     summary: 获取所有游记列表（管理员视角）
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: 每页数量
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: 游记状态
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/travels', authenticateAdmin, adminController.getTravelList);

/**
 * @swagger
 * /api/admin/travels/{id}:
 *   get:
 *     summary: 获取游记详情（管理员视角）
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 游记ID
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 游记不存在
 */
router.get('/travels/:id', authenticateAdmin, adminController.getTravelDetail);

/**
 * @swagger
 * /api/admin/travels/{id}/audit:
 *   post:
 *     summary: 审核游记
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: 游记ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject, delete]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 审核成功
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权
 *       403:
 *         description: 权限不足
 *       404:
 *         description: 游记不存在
 */
router.post('/travels/:id/audit', authenticateAdmin, adminController.auditTravel);

export default router;
