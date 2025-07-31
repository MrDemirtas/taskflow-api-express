const { body, query, validationResult, param } = require("express-validator");

exports.validateProjectQuery = () => {
  return [
    query("sort")
      .optional()
      .isIn(["-createdAt", "createdAt", "-updatedAt", "updatedAt", "-name", "name", "-description", "description"])
      .withMessage("Geçersiz sıralama parametresi"),
    query("page")
      .optional()
      .isInt()
      .withMessage("Geçersiz sayfa numarası")
      .isInt({ min: 1 })
      .withMessage("Sayfa numarası 1'den büyük olmalıdır"),
    query("limit")
      .optional()
      .isInt()
      .withMessage("Geçersiz limit")
      .isInt({ min: 1 })
      .withMessage("Limit 1'den büyük olmalıdır"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validateProjectBodyPost = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Proje adı boş olamaz")
      .isString()
      .withMessage("Proje adı string olmalıdır")
      .isLength({ min: 3 })
      .withMessage("Proje adı en az 3 karakter olmalıdır")
      .isLength({ max: 100 })
      .withMessage("Proje adı en fazla 100 karakter olmalıdır"),
    body("description")
      .optional()
      .isString()
      .withMessage("Proje açıklaması string olmalıdır")
      .isLength({ max: 1000 })
      .withMessage("Proje açıklaması en fazla 1000 karakter olmalıdır"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validateProjectBodyPut = () => {
  return [
    param("id").isMongoId().withMessage("Geçersiz proje ID'si"),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Proje adı boş olamaz")
      .isString()
      .withMessage("Proje adı string olmalıdır")
      .isLength({ min: 3 })
      .withMessage("Proje adı en az 3 karakter olmalıdır")
      .isLength({ max: 100 })
      .withMessage("Proje adı en fazla 100 karakter olmalıdır"),
    body("description")
      .optional()
      .isString()
      .withMessage("Proje açıklaması string olmalıdır")
      .isLength({ max: 1000 })
      .withMessage("Proje açıklaması en fazla 1000 karakter olmalıdır"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validateProjectId = () => {
  return [
    param("id").isMongoId().withMessage("Geçersiz proje ID'si"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validTransitions = {
  todo: ["in-progress"],
  "in-progress": ["todo", "done"],
  done: [],
};
