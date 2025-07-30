/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - project
 *         - owner
 *       properties:
 *         _id:
 *           type: string
 *           description: Görev ID'si
 *         title:
 *           type: string
 *           description: Görev başlığı
 *           minLength: 3
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: Görev açıklaması
 *           maxLength: 1000
 *         status:
 *           type: string
 *           description: Görev durumu
 *           enum: [todo, in-progress, done]
 *           default: todo
 *         priority:
 *           type: string
 *           description: Görev önceliği
 *           enum: [low, medium, high]
 *         estimateHours:
 *           type: number
 *           description: Tahmini tamamlanma süresi (saat)
 *           default: 1
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Görevin bitiş tarihi
 *         deadlineDate:
 *           type: string
 *           format: date-time
 *           description: Görevin son teslim tarihi
 *         project:
 *           type: string
 *           description: Görevin bağlı olduğu proje ID'si
 *         owner:
 *           type: string
 *           description: Görevi oluşturan kullanıcı ID'si
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Görev oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Görev güncelleme tarihi
 */