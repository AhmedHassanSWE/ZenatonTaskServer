const { body, validationResult } = require("express-validator");

const postValidationRules = () => {
  return [
    body("title").isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
    body("content").isLength({ min: 10 }).withMessage("Content must be at least 10 characters long"),
    body("imageUrl").isURL().withMessage("Invalid URL format"),
  ];
};

const validatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsObject = {};
    errors.array().forEach((err) => (errorsObject[err.path] = err.msg));
    return res.status(400).json({ message: "Invalid data", errors: errorsObject });
  }
  next();
};

module.exports = {
  postValidationRules,
  validatePost,
};
