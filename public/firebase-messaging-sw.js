/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

firebase.initializeApp({
  apiKey: 'AIzaSyCIWXmH6u3LEfNHDVKFtO0DUm--g88SPdo',
  authDomain: 'chat-app-10f7a.firebaseapp.com',
  projectId: 'chat-app-10f7a',
  storageBucket: 'chat-app-10f7a.appspot.com',
  messagingSenderId: '761991523556',
  appId: '1:761991523556:web:b8e6327ee55fd8446e10f1',
});

firebase.messaging();
