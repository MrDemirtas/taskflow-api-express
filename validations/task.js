const { body, query, validationResult, param } = require("express-validator");

exports.validateTaskQuery = () => {
  return [
    query("sort")
      .optional()
      .isIn([
        "-createdAt",
        "createdAt",
        "-updatedAt",
        "updatedAt",
        "-title",
        "title",
        "-description",
        "description",
        "-status",
        "status",
        "-priority",
        "priority",
        "-estimatedTime",
        "estimatedTime",
        "-dueDate",
        "dueDate",
        "-deadlineDate",
        "deadlineDate",
      ])
      .withMessage("Geçersiz sort parametresi"),
    query("page")
      .optional()
      .isInt()
      .withMessage("Geçersiz page parametresi")
      .isInt({ min: 1 })
      .withMessage("page 1'den büyük olmalıdır"),
    query("limit")
      .optional()
      .isInt()
      .withMessage("Geçersiz limit parametresi")
      .isInt({ min: 1 })
      .withMessage("limit 1'den büyük olmalıdır"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validateTaskBodyPost = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("title boş olamaz")
      .isString()
      .withMessage("title string olmalıdır")
      .isLength({ min: 3 })
      .withMessage("title en az 3 karakter olmalıdır")
      .isLength({ max: 100 })
      .withMessage("title en fazla 100 karakter olmalıdır"),
    body("description")
      .optional()
      .isString()
      .withMessage("description string olmalıdır")
      .isLength({ max: 1000 })
      .withMessage("description en fazla 1000 karakter olmalıdır"),
    body("priority")
      .notEmpty()
      .withMessage("Priority boş olamaz")
      .isIn(["low", "medium", "high"])
      .withMessage("Geçersiz priority. Sadece low, medium veya high değerleri kabul edilir."),
    body("estimateHours")
      .notEmpty()
      .withMessage("Estimate hours boş olamaz")
      .isInt()
      .withMessage("Geçersiz estimate hours. Sadece sayısal değerler kabul edilir.")
      .isInt({ min: 1 })
      .withMessage("Estimate hours 1'den büyük olmalıdır"),
    body("project").isMongoId().withMessage("Geçersiz proje ID'si"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validateTaskBodyPut = () => {
  return [
    param("id").isMongoId().withMessage("Geçersiz task ID'si"),
    body("title")
      .optional()
      .notEmpty()
      .withMessage("title boş olamaz")
      .isString()
      .withMessage("title string olmalıdır"),
    body("description")
      .optional()
      .isString()
      .withMessage("description string olmalıdır")
      .isLength({ max: 1000 })
      .withMessage("description en fazla 1000 karakter olmalıdır"),
    body("status")
      .optional()
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Geçersiz status. Sadece todo, in-progress veya done değerleri kabul edilir."),
    body("priority")
      .optional()
      .isIn(["low", "medium", "high"])
      .withMessage("Geçersiz priority. Sadece low, medium veya high değerleri kabul edilir."),
    body("estimateHours")
      .optional()
      .isInt()
      .withMessage("Geçersiz estimate hours. Sadece sayısal değerler kabul edilir.")
      .isInt({ min: 1 })
      .withMessage("Estimate hours 1'den büyük olmalıdır"),
    body("project").optional().isMongoId().withMessage("Geçersiz proje ID'si"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validateTaskId = () => {
  return [
    param("id").isMongoId().withMessage("Geçersiz task ID'si"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};
