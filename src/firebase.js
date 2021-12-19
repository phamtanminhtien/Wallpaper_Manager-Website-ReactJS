import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCsau2ORtQJUzkwAC4mEniq512qCV4hipA',
  authDomain: 'wall-47c0d.firebaseapp.com',
  databaseURL: 'https://wall-47c0d.firebaseio.com',
  projectId: 'wall-47c0d',
  storageBucket: 'wall-47c0d.appspot.com',
  messagingSenderId: '124983261229',
  appId: '1:124983261229:web:534fce093f340159b1a0a4',
  measurementId: 'G-7SFM038773'
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
export default firebase;
