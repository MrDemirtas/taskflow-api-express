/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Kullanıcı ID'si
 *         name:
 *           type: string
 *           description: Kullanıcı adı
 *           minLength: 3
 *         email:
 *           type: string
 *           description: Kullanıcı email adresi
 *           format: email
 *         password:
 *           type: string
 *           description: Kullanıcı şifresi (hash'lenmiş olarak saklanır)
 *           minLength: 6
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Kullanıcı oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Kullanıcı güncelleme tarihi
 */