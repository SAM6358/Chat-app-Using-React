/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
/* eslint-disable comma-dangle */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable arrow-parens */
/* eslint-disable object-curly-spacing */
/* eslint-disable linebreak-style */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const database = admin.database();
const messaging = admin.messaging();

exports.sendFcm = functions.https.onCall(async (data, context) => {
  checkIfAuth(context);

  const { chatId, message, title } = data;
  const roomSnap = await database.ref(`/rooms/${chatId}`).once('value');
  if (!roomSnap.exists()) {
    return false;
  }
  const roomData = roomSnap.val();
  checkIfAllowed(context, transformToArr(roomData.admins));

  const fcmUsers = transformToArr(roomData.fcmUsers);
  const userTokensPromises = fcmUsers.map(uid => getUserTokens(uid));
  const userTokensResult = await Promise.all(userTokensPromises);
  const tokens = userTokensResult.reduce(
    (accTokens, userTokens) => [...accTokens, ...userTokens],
    []
  );
  if (tokens.length === 0) {
    return false;
  }
  const fcmMesaage = {
    notification: {
      title: `${title} (${roomData.name})`,
      body: message,
    },
    tokens,
  };
  const batchResponse = await messaging.sendMulticast(fcmMesaage);
  const failedTokens = [];
  if (batchResponse.failureCount > 0) {
    batchResponse.responses.forEach((resp, indx) => {
      if (!resp.success) {
        failedTokens.push(tokens[indx]);
      }
    });
  }

  const removeFailedPromises = failedTokens.map(token =>
    database.ref(`/fcm_tokens/${token}`).remove()
  );
  return Promise.all(removeFailedPromises).catch(error => error.message);
});

function checkIfAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Please sign in to continue.'
    );
  }
}

function checkIfAllowed(context, chatAdmins) {
  if (!chatAdmins.includes(context.auth.uid)) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Access Restricted'
    );
  }
}

function transformToArr(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}

async function getUserTokens(uid) {
  const userTokensSnap = await database
    .ref('/fcm_tokens')
    .orderByValue()
    .equalTo(uid)
    .once('value');
  if (!userTokensSnap.hasChildren()) {
    return [];
  }

  return Object.keys(userTokensSnap.val());
}
