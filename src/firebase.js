import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAQPNmGQtR5qaBNZ-yNaCg_FGAXUBoQgeo",
    authDomain: "keep-a-note.firebaseapp.com",
    databaseURL: "https://keep-a-note.firebaseio.com",
    projectId: "keep-a-note",
    storageBucket: "keep-a-note.appspot.com",
    messagingSenderId: "401859434308",
    appId: "1:401859434308:web:4d08c1e73134a31119e911",
    measurementId: "G-R7HN8RHKC2"
});

const db = firebaseApp.firestore();

export default db;