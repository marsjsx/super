import firebase from 'firebase';
// import { firebase as firebase1 } from '@react-native-firebase/auth';

import ENV from '../env';
require('firebase/firestore')

const config = {
  apiKey: ENV.apiKey,
  authDomain: ENV.authDomain,
  databaseURL: ENV.databaseURL,
  projectId: ENV.projectId,
  storageBucket: ENV.storageBucket,
  messagingSenderId: ENV.messagingSenderId,
  appId: ENV.appId
};

firebase.initializeApp(config)
// firebase1.initializeApp(config)

const db = firebase.firestore()

//Need to add this to forgo deprecated warnings
//db.settings({
//  timestampsInSnapshots: true
//});

export default db;
