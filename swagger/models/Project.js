/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - name
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: Proje ID'si
 *         name:
 *           type: string
 *           description: Proje adı
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: Proje açıklaması
 *           maxLength: 1000
 *         owner:
 *           type: string
 *           description: Projeyi oluşturan kullanıcı ID'si
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Proje oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Proje güncelleme tarihi
 */