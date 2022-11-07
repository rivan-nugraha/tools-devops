const firebaseConfig = {
    apiKey: "AIzaSyA6R9qMJLBAsi_ZtOfO_c4aKLsAWJPiRPs",
    authDomain: "gambar-ai.firebaseapp.com",
    projectId: "gambar-ai",
    storageBucket: "gambar-ai.appspot.com",
    messagingSenderId: "741221155339",
    appId: "1:741221155339:web:9b4a37e42a33686eb67d0e",
    measurementId: "G-RQK58F7CH4"
};
const firebaseModule = require('firebase')
const fsPromise = require('fs/promises')
require('dotenv/config')



const firebase = firebaseModule.initializeApp(firebaseConfig)
async function main() {
    const files = await fsPromise.readdir('./WEB-MIGRASI')
    for (let i = 0; i < files.length; i++) {
        const file = await fsPromise.readFile(`./WEB-MIGRASI/${files[i]}`)
        await postImage(file, files[i])
            .catch(err => console.log(err))

        console.log('file', files[i], 'has been push!')
    }
	console.log("Image Successfully Pushed")
}

function postImage(file, name) {
    return new Promise((resolve, reject) => {
        const storage = firebase.storage();
        let stoageRef = storage.ref(`NSIPIC/${process.env.KODE_TOKO}/foto_produk/` + name);
        stoageRef
            .put(file)
            .then(() => resolve(name))
            .catch((err) => {
                reject(JSON.parse(err));
            });
    });
}

setTimeout(() => main(), 1000)
