const firebaseModule = require('firebase');
const firebaseConfig = require('./config');

let firebase;

if (!firebaseModule.apps.length) {
    firebase = firebaseModule.initializeApp(firebaseConfig);
} else {
    firebase = firebaseModule.app(); // gunakan yang sudah ada
}

module.exports = {
    firebase,
    storage: firebase.storage(),
};