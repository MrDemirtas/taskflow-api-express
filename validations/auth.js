const { body, validationResult } = require("express-validator");

exports.validateRegister = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name boş olamaz")
      .isString()
      .withMessage("Name string olmalıdır")
      .isLength({ min: 3 })
      .withMessage("Name en az 3 karakter olmalıdır"),
    body("email").notEmpty().withMessage("Email boş olamaz").isEmail().withMessage("Email geçersiz"),
    body("password")
      .notEmpty()
      .withMessage("Password boş olamaz")
      .isString()
      .withMessage("Password string olmalıdır")
      .isLength({ min: 6 })
      .withMessage("Password en az 6 karakter olmalıdır"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

exports.validateLogin = () => {
  return [
    body("email").notEmpty().withMessage("Email boş olamaz").isEmail().withMessage("Email geçersiz"),
    body("password")
      .notEmpty()
      .withMessage("Password boş olamaz")
      .isString()
      .withMessage("Password string olmalıdır")
      .isLength({ min: 6 })
      .withMessage("Password en az 6 karakter olmalıdır"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
};
