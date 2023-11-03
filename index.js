const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const credentials = require("./key.json");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

// Auth middleware
const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(403).send("Unauthorized");
    return;
  }

  const idToken = authorization.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(403).send("Unauthorized");
  }
};

app.use("/posts", authenticateUser);

// Create a new post
app.post("/posts", async (req, res) => {
  try {
    const post = {
      title: req.body.title,
      content: req.body.content,
      imageUrl: req.body.imageUrl,
      userId: req.user.user_id,
    };
    await db.collection("posts").add(post);

    const postsSnapshot = await db.collection("posts").get();
    const posts = [];
    postsSnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    res.send(posts);
  } catch (err) {
    res.status(500).send(err.message);
    console.error("Error creating post:", err);
  }
});

// Get all posts
app.get("/posts", async (req, res) => {
  try {
    const postsSnapshot = await db.collection("posts").get();
    const posts = [];
    postsSnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    res.send(posts);
  } catch (err) {
    res.status(500).send(err.message);
    console.error("Error getting posts:", err);
  }
});

// Update a post
app.put("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const postRef = db.collection("posts").doc(postId);
    const doc = await postRef.get();
    if (doc.exists) {
      const postData = doc.data();
      if (postData.userId !== req.user.user_id) {
        res.status(401).send("Unauthorized");
      } else {
        await postRef.update(req.body);

        const postsSnapshot = await db.collection("posts").get();
        const posts = [];
        postsSnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });

        res.send(posts);
      }
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
    console.error("Error updating post:", err);
  }
});

// Delete a post
app.delete("/posts/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const postRef = db.collection("posts").doc(postId);
    const doc = await postRef.get();
    if (doc.exists) {
      const postData = doc.data();
      if (postData.userId !== req.user.user_id) {
        res.status(401).send("Unauthorized");
      } else {
        await db.collection("posts").doc(postId).delete();
        const postsSnapshot = await db.collection("posts").get();
        const posts = [];
        postsSnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        res.send(posts);
      }
    } else {
      res.status(404).send("Post not found");
    }
  } catch (err) {
    res.status(500).send(err.message);
    console.error("Error deleting post:", err);
  }
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`########### Server is running on port ${PORT} ############`));
