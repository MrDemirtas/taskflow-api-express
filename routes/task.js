const express = require("express");
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");

const protect = require("../middleware/auth");

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Tüm görevleri getir
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sort
 *         in: query
 *         required: false
 *         description: Görevleri sıralama
 *         schema:
 *           type: string
 *           default: -createdAt
 *       - name: page
 *         in: query
 *         required: false
 *         description: Sayfa numarası
 *         schema:
 *           type: number
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Limit
 *         schema:
 *           type: number
 *           default: 10
 *       - name: status
 *         in: query
 *         required: false
 *         description: Görevleri sıralama
 *         schema:
 *           type: string
 *           enum:
 *             - todo
 *             - in-progress
 *             - done
 *       - name: priority
 *         in: query
 *         required: false
 *         description: Görevleri sıralama
 *         schema:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *
 *     responses:
 *       200:
 *         description: Tüm görevleri getirir
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Görevleri getirme hatası
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Yeni görev oluştur
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 enum:
 *                   - todo
 *                   - in-progress
 *                   - done
 *                 default: todo
 *               priority:
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 default: medium
 *               estimateHours:
 *                 type: number
 *                 default: 1
 *               project:
 *                 type: string
 *     responses:
 *       201:
 *         description: Görev oluşturuldu
 *       400:
 *         description: Görev oluşturma hatası
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Görev oluşturma hatası
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Görevi güncelle
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Görevin ID'si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 enum:
 *                   - todo
 *                   - in-progress
 *                   - done
 *                 default: todo
 *               priority:
 *                 enum:
 *                   - low
 *                   - medium
 *                   - high
 *                 default: medium
 *               estimateHours:
 *                 type: number
 *                 default: 1
 *               project:
 *                 type: string
 *               owner:
 *                 type: string
 *     responses:
 *       200:
 *         description: Görev güncellendi
 *       404:
 *         description: Görev bulunamadı
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Görevi güncelleme hatası
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Görevi sil
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Görevin ID'si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Görevi silindi
 *       404:
 *         description: Görev bulunamadı
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Görevi silme hatası
 */
