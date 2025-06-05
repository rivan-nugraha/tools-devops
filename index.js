require('dotenv/config');
const { execUpload } = require('./upload');
const { execDownload } = require('./download');

async function getInquirer() {
    const { default: inquirer } = await import('inquirer');
    return inquirer;
}

async function main() {
    try {
        const inquirer = await getInquirer();

        const answer = await inquirer.prompt([
            {
                type:"input",
                name:"kode_toko",
                message: "Silahkan masukan kode toko",
                default: "NQC"
            },
            {
                type: 'list',
                name: 'mode',
                message: 'Pilih aksi yang ingin dijalankan:',
                choices: [
                { key: "u", name: '📤 Upload Gambar', value: 'upload' },
                { key: "d", name: '📥 Download Gambar', value: 'download' },
                ],
            },
        ]);
        
        const mode = answer.mode;
        const kode_toko = answer.kode_toko;

        if (mode === 'upload') {
            await execUpload(kode_toko);
        } else if (mode === 'download') {
            await execDownload(kode_toko);
        }
    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err.message);
    }
}

main();