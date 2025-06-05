require('dotenv/config');
const { execUpload } = require('./upload');
const { execDownload } = require('./download');
const express = require('express');
const bodyParser = require('body-parser');

require('dotenv')
const app = express()
const port = process.env.PORT;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
    );
    next();
})

// async function getInquirer() {
//     const { default: inquirer } = await import('inquirer');
//     return inquirer;
// }

// async function main() {
//     try {
//         const inquirer = await getInquirer();

//         const answer = await inquirer.prompt([
//             {
//                 type:"input",
//                 name:"kode_toko",
//                 message: "Silahkan masukan kode toko",
//                 default: "NQC"
//             },
//             {
//                 type: 'list',
//                 name: 'mode',
//                 message: 'Pilih aksi yang ingin dijalankan:',
//                 choices: [
//                 { key: "u", name: '📤 Upload Gambar', value: 'upload' },
//                 { key: "d", name: '📥 Download Gambar', value: 'download' },
//                 ],
//             },
//         ]);
        
//         const mode = answer.mode;
//         const kode_toko = answer.kode_toko;

//         if (mode === 'upload') {
//             await execUpload(kode_toko);
//         } else if (mode === 'download') {
//             await execDownload(kode_toko);
//         }
//     } catch (err) {
//         console.error('❌ Terjadi kesalahan:', err.message);
//     }
// }


app.post('/download', async (req, res) => {
    try {
        const kode_toko = req.body.kode_toko;
        await execDownload(kode_toko);
        res.status(200).send(`Download Image Kode Toko: ${kode_toko} SUCCESS`)
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/upload', async (req, res) => {
    try {
        const kode_toko = req.body.kode_toko;
        await execUpload(kode_toko);
        res.status(200).send(`Upload Image Kode Toko: ${kode_toko} SUCCESS`)
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});