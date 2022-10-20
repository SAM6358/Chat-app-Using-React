/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://chat-app-10f7a-default-rtdb.firebaseio.com',
});

// eslint-disable-next-line object-curly-spacing
const { sendFcm } = require('./src/fcm');
exports.sendFcm = sendFcm;
