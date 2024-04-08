const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const credentials = require("./key.json");
const postRoutes = require("./routes/postRoutes");
// 
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/posts", postRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`########### Server is running on port ${PORT} ############`));

module.exports = app;
