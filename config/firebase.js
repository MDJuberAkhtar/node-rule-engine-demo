var admin = require("firebase-admin");

var serviceAccount = require("./fir-test-d154b-firebase-adminsdk-7v8jz-8e8734c933.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-test-d154b-default-rtdb.firebaseio.com"
});

const database = admin.database();
module.exports.usersRef = database.ref('/users');
module.exports.rulessRef = database.ref('/rules');
