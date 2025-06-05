const fs = require('fs');
const axios = require('axios');
require('dotenv/config');

// const firebase = firebaseModule.initializeApp(firebaseConfig);
const { storage } = require('./firebase');

async function getPLimit() {
    const module = await import('p-limit');
    return module.default;
}

async function execDownload() {
    const pLimit = await getPLimit();
    const limit = pLimit(5);
    try {
        const storeCode = process.env.KODE_TOKO;
        if (!storeCode) {
            throw new Error('KODE_TOKO not set in environment variables.');
        }

        const fileRef = storage.ref(`NSIPIC/${storeCode}/foto_produk`);
        const fileList = await fileRef.listAll();

        await downloadImages(fileList.items, storeCode, limit);
        console.log('[SUCCESS] All files downloaded!');
    } catch (error) {
        console.error('[ERROR]', error.message);
    }
}

async function downloadImages(files, storeCode, limit) {
    if (!files.length) {
        console.log('[INFO] No files found to download.');
        return;
    }

    const downloadDir = `downloads/${storeCode}/`;
    fs.mkdirSync(downloadDir, { recursive: true });

    const tasks = files.map((fileRef) =>
        limit(async () => {
            const filename = fileRef.name;

            try {
                const downloadURL = await fileRef.getDownloadURL();

                if (!isImage(filename)) {
                    console.log(`[SKIPPED] ${filename} is not an image.`);
                    return;
                }

                await saveImage(downloadURL, `${downloadDir}${filename}`);
                console.log(`[DOWNLOADED] ${filename}`);
            } catch (err) {
                if (err.code === 'storage/object-not-found') {
                    console.warn(`[SKIPPED] ${filename} not found in storage.`);
                } else {
                    console.error(`[ERROR] Failed to download ${filename}:`, err.message);
                }
            }
        })
    );

    await Promise.all(tasks);
}

async function saveImage(url, destPath) {
    const response = await axios.get(url, { responseType: 'stream' });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(destPath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

function isImage(filename) {
    return /\.(jpg|jpeg|png|webp|svg)$/i.test(filename);
}

module.exports = { execDownload };