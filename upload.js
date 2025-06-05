const fs = require('fs/promises');
require('dotenv/config');

const { firebase } = require('./firebase');

async function getPLimit() {
    const { default: pLimit } = await import('p-limit');
    return pLimit;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function retry(fn, retries = 3, delayMs = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1) throw err;
            console.warn(`⚠️ Retry ${i + 1} failed, retrying in ${delayMs}ms...`);
            await delay(delayMs);
        }
    }
}

async function execUpload(kode_toko) {
    const pLimit = await getPLimit();
    const limit = pLimit(5); // concurrency limit

    const folderPath = './WEB-MIGRASI';

    if (!kode_toko) {
        console.error('❌ Kode Toko Belum Di Masukan');
        process.exit(1);
    }

    const fileNames = await fs.readdir(folderPath);
    let successCount = 0;
    let failCount = 0;

    const tasks = fileNames.map(fileName =>
        limit(async () => {
            try {
                const fileBuffer = await fs.readFile(`${folderPath}/${fileName}`);
                await uploadImage(fileBuffer, fileName, kode_toko);
                console.log(`✅ Uploaded: ${fileName}`);
                successCount++;
            } catch (err) {
                console.error(`❌ Failed to upload ${fileName}:`, err.message || err);
                failCount++;
            }
        })
    );

    await Promise.all(tasks);

    console.log('\n=== Upload Summary ===');
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('🎉 All tasks completed');
    process.exit(1);
}

async function uploadImage(fileBuffer, fileName, kodeToko) {
    const storage = firebase.storage();
    const refPath = `NSIPIC/${kodeToko}/foto_produk/${fileName}`;
    const storageRef = storage.ref(refPath);

    await retry(() => storageRef.put(fileBuffer), 3, 1500);
}

module.exports = { execUpload };