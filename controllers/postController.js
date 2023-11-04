const convertLink = require("../utils/handle-link");
const { createPostModel, getAllPostsModel, updatePostModel, deletePostModel } = require("../models/postModel");

const admin = require("firebase-admin");

const createPost = async (req, res) => {
  try {
    const imageLink = await convertLink(req.body.imageUrl);
    const post = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: imageLink,
      userId: req.user.user_id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await createPostModel(post);

    const posts = await getAllPostsModel();
    res.status(201).send(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsModel();
    res.send(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePost = async (req, res) => {
  try {
    const imageLink = await convertLink(req.body.imageUrl);
    const postId = req.params.id;
    const post = req.body;

    const doc = await updatePostModel(postId, post);
    const posts = await getAllPostsModel();
    res.send(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await deletePostModel(postId);
    const posts = await getAllPostsModel();
    res.send(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = { createPost, getAllPosts, updatePost, deletePost };
