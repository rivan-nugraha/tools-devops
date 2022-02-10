const firebaseConfig = require('./config');
const firebaseModule = require('firebase')
const firebase = firebaseModule.initializeApp(firebaseConfig)
const fs = require("fs")
const axios = require("axios")
const { resolve } = require('path');
require('dotenv/config')

async function main() {
    try {
        const kodeToko = _getFromEnv()
        const storage = firebase.storage()
        const pathReference = storage.ref(`NSIPIC/${kodeToko}/foto_produk`)
        const listFiles = await pathReference.listAll()
        await _saveImage(listFiles.items)
        console.log('[SUCCESS] All files Downloaded!')
        return;
    } catch (err) {
        console.log("[ERROR]", err.message)
    }
}

function _getFromEnv() {
    return process.env.KODE_TOKO
}

async function _saveImage(listFiles) {
    for (const file of listFiles) {
        const imageURL = await file.getDownloadURL()
        fs.mkdirSync(`downloads/${_getFromEnv()}/`, {recursive: true})
        await _downloadImage(imageURL, file.name)
        console.log(file.name, 'downloaded')
    }
}

async function _downloadImage(url, name) {
    return new Promise((resolve, reject) => {
        axios({
            url,
            method: "GET",
            responseType: 'stream'
        }).then(async (response) => {
            response.data.pipe(fs.createWriteStream(`downloads/${_getFromEnv()}/${name}`, { recursive: true }))
            resolve(name)
        })
    })
}

main()