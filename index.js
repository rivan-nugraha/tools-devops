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

        if (mode === 'upload') {
            await execUpload();
        } else if (mode === 'download') {
            await execDownload();
        }
    } catch (err) {
        console.error('❌ Terjadi kesalahan:', err.message);
    }
}

main();