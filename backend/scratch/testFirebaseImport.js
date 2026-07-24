const admin = require('firebase-admin');
console.log('Keys of require("firebase-admin"):', Object.keys(admin));
console.log('Type of admin.credential:', typeof admin.credential);
if (admin.default) {
  console.log('Keys of require("firebase-admin").default:', Object.keys(admin.default));
}
