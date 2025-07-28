const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getStatusDistribution,
  getUserWorkload,
  getAverageCompletionTime,
  getCompletedTaskWeekly,
  getCompletedTaskDaily,
  getUpcomingDeadlines,
} = require("../controllers/statsController");

router.use(protect);

router.get("/status-distribution", getStatusDistribution);
router.get("/user-workload", getUserWorkload);
router.get("/avg-completion-time", getAverageCompletionTime);
router.get("/completed-weekly", getCompletedTaskWeekly);
router.get("/completed-daily", getCompletedTaskDaily);
router.get("/upcoming-deadlines", getUpcomingDeadlines);

module.exports = router;

/**
 * @swagger
 * /api/stats/status-distribution:
 *   get:
 *     summary: Görev durum dağılımını getirir
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Görev durum dağılımını getirir.
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: İç sunucu hatası
 */

/**
 * @swagger
 * /api/stats/user-workload:
 *   get:
 *     summary: Kullanıcı yükünü getirir.
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Kullanıcı yükünü getirir.
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: İç sunucu hatası
 */

/**
 * @swagger
 * /api/stats/avg-completion-time:
 *   get:
 *     summary: Ortalama görev tamamlama süresini getirir
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Ortalama görev tamamlama süresini getirir.
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: İç sunucu hatası
 */

/**
 * @swagger
 * /api/stats/completed-weekly:
 *   get:
 *     summary: Haftalık tamamlanan görev sayısını getirir
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Haftalık tamamlanan görev sayısını getirir.
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: İç sunucu hatası
 */

/**
 * @swagger
 * /api/stats/completed-daily:
 *   get:
 *     summary: Günlük tamamlanan görev sayısını getirir
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Günlük tamamlanan görev sayısını getirir.
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: İç sunucu hatası
 */

/**
 * @swagger
 * /api/stats/upcoming-deadlines:
 *   get:
 *     summary: Son tarihleri yaklaşan görevleri getirir
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Son tarihleri yaklaşan görevleri getirir.
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: İç sunucu hatası
 */
