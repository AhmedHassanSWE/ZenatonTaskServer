const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authenticateUser = require("../middleware/isAuth");
const { postValidationRules, validatePost } = require("../validations/postValidations");

router.post("/", postValidationRules(), validatePost, authenticateUser, postController.createPost);
router.get("/", postController.getAllPosts);
router.put("/:id", postValidationRules(), validatePost, authenticateUser, postController.updatePost);
router.delete("/:id", authenticateUser, postController.deletePost);

module.exports = router;
