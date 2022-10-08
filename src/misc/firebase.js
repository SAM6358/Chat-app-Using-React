import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: 'AIzaSyCIWXmH6u3LEfNHDVKFtO0DUm--g88SPdo',
  authDomain: 'chat-app-10f7a.firebaseapp.com',
  projectId: 'chat-app-10f7a',
  storageBucket: 'chat-app-10f7a.appspot.com',
  messagingSenderId: '761991523556',
  appId: '1:761991523556:web:b8e6327ee55fd8446e10f1',
};

const app = firebase.initializeApp(config);

export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
