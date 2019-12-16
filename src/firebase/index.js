import firebase from 'firebase';
import { firebaseConfig } from './config.js';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const database = firebaseApp.database();
export const storage = firebaseApp.storage();
export const providerTwitter = new firebase.auth.TwitterAuthProvider();