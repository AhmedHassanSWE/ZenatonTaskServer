const firebaseApp = require("../config/firebase-config");
const admin = require("firebase-admin");
const { validate } = require("jsonschema");
const db = firebaseApp.firestore();
const postSchema = require("../schemas/postSchema");

const createPostModel = async (post) => {
  const validationResult = validate(post, postSchema);
  if (!validationResult.valid) {
    throw new Error("Invalid post data");
  }

  const docRef = await db.collection("posts").add(post);
  return docRef.id;
};

const getAllPostsModel = async () => {
  const postsSnapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
  const posts = [];
  postsSnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });
  return posts;
};

const updatePostModel = async (postId, post) => {
  await db.collection("posts").doc(postId).update(post);
};

const deletePostModel = async (postId) => {
  await db.collection("posts").doc(postId).delete();
};

module.exports = { createPostModel, getAllPostsModel, updatePostModel, deletePostModel, postSchema };
