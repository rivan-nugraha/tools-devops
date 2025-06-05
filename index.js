const firebaseConfig = require('./config');
const firebaseModule = require('firebase');
const fs = require('fs/promises');
require('dotenv/config');

const firebase = firebaseModule.initializeApp(firebaseConfig);

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

async function main() {
    const pLimit = await getPLimit();
    const limit = pLimit(5); // concurrency limit

    const folderPath = './WEB-MIGRASI';
    const kodeToko = process.env.KODE_TOKO;

    if (!kodeToko) {
        console.error('❌ Missing KODE_TOKO in environment variables');
        process.exit(1);
    }

    const fileNames = await fs.readdir(folderPath);
    let successCount = 0;
    let failCount = 0;

    const tasks = fileNames.map(fileName =>
        limit(async () => {
            try {
                const fileBuffer = await fs.readFile(`${folderPath}/${fileName}`);
                await uploadImage(fileBuffer, fileName, kodeToko);
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
}

async function uploadImage(fileBuffer, fileName, kodeToko) {
    const storage = firebase.storage();
    const refPath = `NSIPIC/${kodeToko}/foto_produk/${fileName}`;
    const storageRef = storage.ref(refPath);

    await retry(() => storageRef.put(fileBuffer), 3, 1500);
}

// Start
main().catch(err => {
    console.error('Unhandled error:', err.message || err);
    process.exit(1);
});
