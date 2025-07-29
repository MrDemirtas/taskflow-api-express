const express = require("express");
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");
const protect = require("../middleware/auth");
const {
  validateProjectBodyPost,
  validateProjectBodyPut,
  validateProjectQuery,
  validateProjectId,
} = require("../validations/project");

router.use(protect); // tüm rotaları JWT ile koru

router.get("/", validateProjectQuery(), getProjects); // Tüm projeleri getir

router.post("/", validateProjectBodyPost(), createProject); // Yeni proje oluştur

router.put("/:id", validateProjectBodyPut(), updateProject); // Projeyi güncelle

router.delete("/:id", validateProjectId(), deleteProject); // Projeyi sil

module.exports = router;

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Tüm projeleri getirir
 *     description: Tüm projeleri getirir
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: sort
 *         in: query
 *         required: false
 *         description: Projeleri sıralama
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
 *     responses:
 *       '200':
 *         description: Tüm projeleri getirir
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Projeleri getirme hatası
 */

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Yeni proje oluşturur
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proje oluşturuldu
 *       400:
 *         description: Proje oluşturma hatası
 *       401:
 *         description: Yetkilendirme hatası
 *       500:
 *         description: Proje oluşturma hatası
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Projeyi günceller
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Projenin ID'si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proje güncellendi
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Proje bulunamadı
 *       500:
 *         description: Proje güncelleme hatası
 */

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Projeyi siler
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Projenin ID'si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proje silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Proje bulunamadı
 *       500:
 *         description: Proje silme hatası
 */
