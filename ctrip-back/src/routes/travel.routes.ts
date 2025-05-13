import { Router } from 'express';
import { TravelController } from '../controllers/travel.controller';
import { authenticateUser } from '../middlewares/auth';
import { uploadImages, uploadVideo } from '../middlewares/upload';

const router = Router();
const travelController = new TravelController();

/**
 * @swagger
 * /api/travels:
 *   get:
 *     summary: 获取所有已审核通过的游记列表（首页）
 *     tags: [Travels]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜索关键词
 *     responses:
 *       200:
 *         description: 获取成功
 */
router.get('/', travelController.getTravelList);

/**
 * @swagger
 * /api/travels/user:
 *   get:
 *     summary: 获取当前用户的游记列表
 *     tags: [Travels]
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
 *     responses:
 *       200:
 *         description: 获取成功
 *       401:
 *         description: 未授权
 */
router.get('/user', authenticateUser, travelController.getUserTravels);

/**
 * @swagger
 * /api/travels/{id}:
 *   get:
 *     summary: 获取游记详情
 *     tags: [Travels]
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
 *       404:
 *         description: 游记不存在
 */
router.get('/:id', travelController.getTravelDetail);

/**
 * @swagger
 * /api/travels:
 *   post:
 *     summary: 创建游记
 *     tags: [Travels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 创建成功
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权
 */
router.post('/', authenticateUser, uploadImages, travelController.createTravel);

/**
 * @swagger
 * /api/travels/{id}:
 *   put:
 *     summary: 更新游记
 *     tags: [Travels]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               video:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 更新成功
 *       400:
 *         description: 请求数据验证失败
 *       401:
 *         description: 未授权
 *       404:
 *         description: 游记不存在
 */
router.put('/:id', authenticateUser, uploadImages, uploadVideo, travelController.updateTravel);

/**
 * @swagger
 * /api/travels/{id}:
 *   delete:
 *     summary: 删除游记
 *     tags: [Travels]
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
 *         description: 删除成功
 *       401:
 *         description: 未授权
 *       404:
 *         description: 游记不存在
 */
router.delete('/:id', authenticateUser, travelController.deleteTravel);

export default router;
