// make-admin.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // downloaded from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = process.argv[2]; // pass admin email as arg

if (!email) {
  console.error("Usage: node make-admin.js admin@example.com");
  process.exit(1);
}

async function run() {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log("Set admin claim on", email, "uid:", user.uid);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
run();
