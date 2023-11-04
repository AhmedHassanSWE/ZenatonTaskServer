const admin = require("firebase-admin");
const credentials = require("../key.json");
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = firebaseApp;
