const firebaseConfig = {
    apiKey: "AIzaSyB1JES7FtWNBoz9obp-5Z6HifP5XCsUsOI",
    authDomain: "gambar-78b2b.firebaseapp.com",
    projectId: "gambar-78b2b",
    storageBucket: "gambar-78b2b.appspot.com",
    messagingSenderId: "694976070405",
    appId: "1:694976070405:web:eef580e9823e39e64dad6c",
    measurementId: "G-YX2KKT4KRH"
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
