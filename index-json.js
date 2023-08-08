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
const dataJson = require("./tm_barang_image.json")
require('dotenv/config')



const firebase = firebaseModule.initializeApp(firebaseConfig)
async function main() {
    for (let i = 0; i < dataJson.length; i++) {
        const dataImage = dataJson[i]
        await postImage(dataImage.dataimage, dataImage.kode_barcode)
            .catch(err => console.log(err))

        console.log('file', dataImage.kode_barcode, 'has been push!')
    }
	console.log("Image Successfully Pushed")
}

function postImage(file, name) {
    return new Promise((resolve, reject) => {
        const storage = firebase.storage();
        let stoageRef = storage.ref(`NSIPIC/${process.env.KODE_TOKO}/foto_produk/` + name + ".jpg");
        stoageRef
            .putString(file.replace(/data:image\/(png|jpeg);base64,/, ""), 'base64')
            .then(() => resolve(name))
            .catch((err) => {
                reject(JSON.parse(err));
            });
    });
}

setTimeout(() => main(), 1000)
