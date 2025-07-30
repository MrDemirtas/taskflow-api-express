/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı oluşturur
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kullanıcı oluşturuldu
 *       400:
 *         description: Kullanıcı oluşturma hatası
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi yapar
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kullanıcı girişi başarılı
 *       400:
 *         description: Kullanıcı girişi hatası
 */